"use client";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useState, useEffect,useRef } from "react";
import { CheckCircle, Upload, Loader, MapPin , Leaf} from "lucide-react";
import { useSelector,useDispatch } from "react-redux";
import { useNavigate ,Link} from "react-router-dom";
import { toast } from "sonner";
import { Button } from "../ui/button";
import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import { submitReport } from "@/redux/store/reportSlice";
const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;
const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN;

export default function ReportPage() {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [location, setLocation] = useState("");
  const [wasteType, setWasteType] = useState("Verified waste type");
  const [amount, setAmount] = useState("Verified amount");
  const [verificationStatus, setVerificationStatus] = useState("idle");
  const [verificationResult, setVerificationResult] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [preview, setPreview] = useState(null);
  const [newReport, setNewReport] = useState({
    location: "",
    type: "",
    amount: "",
    address:"",
    latitude: null,
    longitude: null,
    currentLocation: "",
  });
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  const showToast = (title, description, variant = "default") => {
  toast[variant === "destructive" ? "error" : variant === "success" ? "success" : "message"](description, {
    description: title,
  });
};

  useEffect(() => {
  getUserLocation();
}, []);


  useEffect(() => {
    if (!mapboxToken) return;
  
    mapboxgl.accessToken = mapboxToken;
  
    const map = new mapboxgl.Map({
      container: "map-container",
      style: "mapbox://styles/mapbox/streets-v11",
      center: [78.9629, 20.5937],
      zoom: 4,
    });
   
    mapRef.current = map;
    const geocoder = new MapboxGeocoder({
      accessToken: mapboxToken,
      countries: "IN",
      types: "country,region,place,locality,neighborhood,address,postcode,poi",
      placeholder: "Search Indian village or location",
      mapboxgl,
      marker: false,
    });
    map.addControl(geocoder);
  
  
    // When result is selected
    geocoder.on("result", (e) => {
      const name = e.result.place_name;
      const [lng, lat] = e.result.center;
  
      setNewReport((prev) => ({ ...prev, location: name }));
      setLocation(name);
  
      if (markerRef.current) {
        markerRef.current.setLngLat([lng, lat]);
      } else {
        markerRef.current = new mapboxgl.Marker().setLngLat([lng, lat]).addTo(map);
      }
      map.flyTo({ center: [lng, lat], zoom: 10 });
    });
  
    //  When input is cleared
    geocoder.on("clear", () => {
      setNewReport((prev) => ({ ...prev, location: "" }));
      setLocation("");
    }); 
  
    return () => {
      map.remove();
    };
  }, []);
  
  
  const getUserLocation = () => {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      async function (position) {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        setNewReport((prevReport) => ({
          ...prevReport,
          latitude: lat,
          longitude: lng,
        }));

        // Reverse geocode using Mapbox
        try {
          const response = await fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${mapboxgl.accessToken}`
          );
          const data = await response.json();
          const place = data.features?.[0]?.place_name || "Unknown location";

          setNewReport((prevReport) => ({
            ...prevReport,
            currentLocation: place, // 🟢 Set the location field
          }));
          showToast("Location Fetched", `Your current location is: ${place}`, "success");
        } catch (err) {
          console.error("Error fetching address:", err);
          showToast("Error Fetching Address", "Could not fetch your address. Please try again later.", "destructive");
        }
      },
      function (error) {
        console.error("Error getting user location:", error);
      }
    );
  } else {
    console.error("Geolocation is not supported by this browser.");
    showToast("Geolocation Error", "Your browser does not support geolocation.", "destructive");
  }
};


  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);

      const reader = new FileReader();
      reader.onload = (event) => {
        setPreview(event.target?.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewReport((prev) => ({ ...prev, [name]: value }));
  };

  const readFileAsBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const verifyWaste = async () => {
    if (!file) return;

    setVerificationStatus("verifying");

    try {
      const genAI = new GoogleGenerativeAI(geminiApiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const base64Data = await readFileAsBase64(file);
      const imageParts = [
        {
          inlineData: {
            data: base64Data,
            mimeType: file.type,
          },
        },
      ];

      const prompt = `You are an expert in waste management and recycling. Analyze this image and provide:
1. The type of waste (e.g., plastic, paper, glass, metal, organic)
2. An estimate of the quantity or amount (in kg or liters)
3. Your confidence level in this assessment (as a percentage)

Respond in JSON format like this:
{
  "wasteType": "type of waste",
  "quantity": "estimated quantity with unit",
  "confidence": confidence level as a number between 0 and 1
}`;

      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }, ...imageParts] }],
      });

      const output =
        result.response.candidates?.[0]?.content?.parts?.[0]?.text || "";

      const jsonMatch = output.match(/\{[\s\S]*?\}/);
      if (!jsonMatch) throw new Error("Invalid Gemini response format.");

      const parsed = JSON.parse(jsonMatch[0]);

      setWasteType(parsed.wasteType || "Unknown");
      setAmount(parsed.quantity || "Unknown");
      setVerificationResult(parsed);
      setNewReport((prev) => ({
        ...prev,
        type: parsed.wasteType || "Unknown",
        amount: parsed.quantity || "Unknown",
      }));
      setVerificationStatus("success");
      showToast("Waste Verified", "Waste type and amount verified successfully!", "success");
    } catch (err) {
      console.error("Gemini verification error:", err);
      setVerificationStatus("failure");
      showToast("Verification Error", "Failed to verify waste. Please try again.", "destructive");
      setWasteType("Verification failed");
      setAmount("Verification failed");
      setVerificationResult(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (verificationStatus !== "success" || !user) {
      showToast("Waste Verification Required", "Please verify the waste before submitting.", "destructive");
      console.log("Please verify the waste before submitting or log in.");
      return;
    }
    if (!file || !newReport.location || !verificationResult) {
  showToast("Missing Information", "Please provide an image, location, and verification result.", "destructive");
  
  return;
}


    setIsSubmitting(true);
    const formData= {
        userId: user._id,
        location: newReport.location || location,
        address: newReport.address || "",
        type: wasteType,
        amount: amount,
        imageUrl: preview||undefined,
        verificationResult: verificationResult|| undefined,
        latitude: newReport.latitude,
        longitude: newReport.longitude,
        currentLocation: newReport.currentLocation || "",
      }
      
      dispatch(submitReport(formData));

      showToast("Report Submitted", "Your waste report has been submitted successfully!", "success");
      setLocation("");
      setWasteType("Verified waste type");
      setAmount("Verified amount");
      setFile(null);
      setPreview(null);
      setVerificationStatus("idle");
      setVerificationResult(null);
      setNewReport({ location: "", type: "", amount: "", address: "" });
      setIsSubmitting(false);
      navigate("/user/my-reports",{ state: { refresh: true }} )
  };
return (
  <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-white py-16 px-4">
    <div className="flex items-center justify-between mb-6">
    <Link to="/user/dashboard" className="flex items-center text-green-800 font-bold text-xl">
      <Leaf size={28} className="mr-2" />
      RecycleConnect
    </Link>
  </div>
  <div className="mx-auto w-full max-w-4xl rounded-3xl bg-white/80 backdrop-blur-lg shadow-2xl ring-1 ring-black/5 p-10">
    
    <h1 className="mb-8 text-center text-4xl font-extrabold tracking-tight text-emerald-700">
      Report Waste
    </h1>

    <form
      onSubmit={handleSubmit}
      className="space-y-10"
    >
      {/* Upload Image */}
      <section>
        <label className="block mb-3 text-lg font-medium text-gray-700">
          Upload Waste Image
        </label>

        <label
          htmlFor="waste-file"
          className="group flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-gray-300 p-8 transition hover:border-emerald-400 hover:bg-emerald-50/50"
        >
          <Upload className="h-12 w-12 text-gray-400 group-hover:text-emerald-500" />
          <span className="text-base font-semibold text-emerald-600 transition group-hover:underline">
            Click or drag a file here
          </span>
          <span className="text-xs text-gray-500">PNG / JPG • Max 10 MB</span>
          <input
            id="waste-file"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="sr-only"
          />
        </label>
      </section>

      {/* Image Preview */}
      {preview && (
        <section className="overflow-hidden rounded-2xl border border-gray-200 shadow inner">
          <img
            src={preview}
            alt="Preview"
            className="h-96 w-full object-contain bg-gray-50"
          />
        </section>
      )}

      {/* Verify Waste Button */}
      <Button
        type="button"
        onClick={verifyWaste}
        disabled={!file || verificationStatus === "verifying"}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-lg font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {verificationStatus === "verifying" && (
          <Loader className="h-5 w-5 animate-spin" />
        )}
        {verificationStatus === "verifying" ? "Verifying…" : "Verify Waste"}
      </Button>

      {/* Verification Result */}
      {verificationStatus === "success" && verificationResult && (
        <section className="rounded-xl border-l-4 border-emerald-500 bg-emerald-50 p-4">
          <h3 className="mb-1 font-semibold text-emerald-800">
            Verification Result
          </h3>
          <p className="text-sm text-emerald-700">
            Waste Type: {verificationResult.wasteType}
            <br />
            Quantity:&nbsp;{verificationResult.quantity}
            <br />
            Confidence:&nbsp;
            {(verificationResult.confidence * 100).toFixed(2)}%
          </p>
        </section>
      )}

      {/* Inputs */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">
            Address Notes&nbsp;(optional)
          </label>
          <input
            type="text"
            name="address"
            value={newReport.address}
            onChange={(e) =>
              setNewReport((prev) => ({ ...prev, address: e.target.value }))
            }
            placeholder="Flat no / landmark / etc."
            className="rounded-xl border border-gray-300 px-4 py-2 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Location</label>
          <input
            type="text"
            readOnly
            value={newReport.location}
            className="rounded-xl border border-gray-300 bg-gray-100 px-4 py-2 text-gray-600"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">
            Current Location
          </label>
          <input
            type="text"
            id="location"
            placeholder="Fetching your location…"
            value={newReport.currentLocation || ""}
            onChange={(e) =>
              setNewReport({ ...newReport, currentLocation: e.target.value })
            }
            className="rounded-xl border border-gray-300 px-4 py-2 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="type" className="text-sm font-medium text-gray-700">
            Waste Type
          </label>
          <input
            type="text"
            id="type"
            name="type"
            value={newReport.type}
            readOnly
            className="rounded-xl border border-gray-300 bg-gray-100 px-4 py-2 text-gray-600"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">
            Estimated Amount
          </label>
          <input
            type="text"
            name="amount"
            value={newReport.amount}
            readOnly
            className="rounded-xl border border-gray-300 bg-gray-100 px-4 py-2 text-gray-600"
          />
        </div>

        {/* Map */}
        <div className="md:col-span-2 flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Map</label>
          <div
            id="map-container"
            className="h-72 w-full rounded-2xl border border-gray-300 shadow-sm"
          />
        </div>
      </div>

      {/* Submit */}
      <Button
        type="submit"
        disabled={isSubmitting}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-lg font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting && <Loader className="h-5 w-5 animate-spin" />}
        {isSubmitting ? "Submitting…" : "Submit Report"}
      </Button>
    </form>
  </div>
</div>
);

}
