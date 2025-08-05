import React, { useRef, useState } from "react";
import { ArrowRight, Upload, Check, Camera, MapPin , Leaf} from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Link } from "react-router-dom";

import toast from "react-hot-toast";
import { GoogleGenerativeAI } from "@google/generative-ai";
const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;
const WasteSorting = () => {
  // State for the image uploader
  const [selectedImage, setSelectedImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [result, setResult] = useState(null);
  // Handle image upload
  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const imageUrl = URL.createObjectURL(file);
    setSelectedImage(imageUrl);

    try {
      const genAI = new GoogleGenerativeAI(geminiApiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      // Convert image to base64
      const base64Data = await convertToBase64(file);
      const strippedBase64 = base64Data.split(",")[1]; // remove "data:image/..." prefix

      const imageParts = [
        {
          inlineData: {
            data: strippedBase64,
            mimeType: file.type, // image/jpeg or image/png
          },
        },
      ];

      const prompt = `
  You are an AI trained to identify waste items in images and provide structured guidance on disposal. Based on the image, return the following in JSON format:
  
  {
    "item": "Name of the waste item",
    "category": "Plastic | Paper | Food | Electronic | Glass | Metal | Other",
    "disposal": "Best way to dispose of this item",
    "tips": [
      "Short tip 1",
      "Short tip 2"
    ]
  }
  
  Only return valid JSON. Do not include any explanation or extra text.
  `;

      const result = await model.generateContent({
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }, ...imageParts],
          },
        ],
      });

      const textResponse =
        result.response.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
      const jsonMatch = textResponse.match(/\{[\s\S]*\}/);

      if (!jsonMatch) {
        throw new Error("Invalid AI response format.");
      }

      const parsedResult = JSON.parse(jsonMatch[0]);

      setResult({
        item: parsedResult.item || "Unknown",
        category: parsedResult.category || "Uncategorized",
        disposal: parsedResult.disposal || "No disposal tip found",
        tips: parsedResult.tips || [],
      });

      toast.success("AI analysis complete! ✅");
    } catch (error) {
      console.error("Gemini API Error:", error);
      toast.error("Failed to analyze the image.");
    } finally {
      setIsUploading(false);
    }
  };

  // Convert image file to base64
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });
  };

  // Reset the state
  const handleReset = () => {
    setSelectedImage(null);
    setResult(null);
  };

  // Waste categories for the guide
  const wasteCategories = [
    {
      id: "plastic-items",
      title: "Plastic Items",
      items: [
        { name: "Plastic Bottles", disposal: "Recycle in plastic bin" },
        {
          name: "Plastic Bags",
          disposal: "Special recycling collection or designated bins",
        },
        {
          name: "Plastic Containers",
          disposal: "Clean and recycle in plastic bin",
        },
      ],
    },
    {
      id: "paper-products",
      title: "Paper Products",
      items: [
        { name: "Newspapers", disposal: "Recycle in paper bin" },
        { name: "Cardboard", disposal: "Flatten and recycle in paper bin" },
        { name: "Office Paper", disposal: "Recycle in paper bin" },
      ],
    },
    {
      id: "food-waste",
      title: "Food Waste",
      items: [
        { name: "Fruit & Vegetable Scraps", disposal: "Compost" },
        {
          name: "Meat & Dairy",
          disposal: "General waste (or specialized food waste collection)",
        },
        { name: "Coffee Grounds", disposal: "Compost" },
      ],
    },
    {
      id: "electronic-waste",
      title: "Electronic Waste",
      items: [
        {
          name: "Batteries",
          disposal: "Special collection points or recycling centers",
        },
        { name: "Old Electronics", disposal: "E-waste recycling center" },
        {
          name: "Light Bulbs",
          disposal: "Special collection (varies by bulb type)",
        },
      ],
    },
  ];
  const [openCategoryId, setOpenCategoryId] = useState(null);

  // Tips for waste sorting
  const tips = [
    "Rinse food containers before recycling",
    "Remove plastic caps from glass bottles",
    "Flatten cardboard boxes to save space",
    "Check the recycling number on plastic items",
    "Keep used batteries separate for special recycling",
    "Compost fruit and vegetable scraps when possible",
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <div className="pt-4 px-10">
        <Link to="/user/dashboard" className="flex items-center text-green-800 font-bold text-xl">
          <Leaf size={28} className="mr-2" />
          RecycleConnect
        </Link>
      </div>
      <main className="flex-grow">
        {/* Hero Section */}
        <div className="bg-green-50 py-12 mb-8">
          <div className="container mx-auto px-6">
            <h1 className="text-4xl md:text-5xl font-bold text-center text-green-700 mb-6">
              AI Waste Sorting Guide
            </h1>
            <p className="text-lg text-center text-gray-700 max-w-3xl mx-auto">
              Upload a photo of any waste item, and our AI will identify what it
              is and tell you the best way to dispose of it. Get instant
              guidance on recycling, composting, or special disposal methods.
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Waste Image Uploader */}
            <div className="lg:col-span-2">
              <Card className="p-6">
                <h2 className="text-2xl font-semibold mb-4">
                  Upload Waste Item
                </h2>

                {!selectedImage ? (
                  <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                    <div className="space-y-6">
                      <div className="flex justify-center">
                        <Upload className="h-12 w-12 text-gray-400" />
                      </div>
                      <div>
                        <p className="text-gray-700 mb-2">
                          Drag and drop your image here or
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                          <label className="cursor-pointer bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded inline-flex items-center justify-center">
                            <Upload className="mr-2 h-4 w-4" />
                            <span>Upload Image</span>
                            <input
                              type="file"
                              className="hidden"
                              accept="image/*"
                              onChange={handleImageUpload}
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="relative border rounded-lg overflow-hidden">
                      <img
                        src={selectedImage}
                        alt="Uploaded waste item"
                        className="w-full object-contain max-h-80"
                      />
                      {isUploading && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                          <div className="text-white">Processing image...</div>
                        </div>
                      )}
                    </div>

                    {result && !isUploading && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <h3 className="font-semibold text-lg mb-2">
                          Analysis Results:
                        </h3>
                        <div className="space-y-2">
                          <p>
                            <span className="font-medium">Item:</span>{" "}
                            {result.item}
                          </p>
                          <p>
                            <span className="font-medium">Category:</span>{" "}
                            {result.category}
                          </p>
                          <p>
                            <span className="font-medium">How to dispose:</span>{" "}
                            {result.disposal}
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="flex justify-end">
                      <Button
                        onClick={handleReset}
                        variant="outline"
                        className="mr-2"
                      >
                        Try Another Image
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            </div>

            {/* Right Column - Waste Guide */}
            <div>
              <Card className="p-6">
                <h2 className="text-2xl font-semibold mb-4">
                  Common Waste Guide
                </h2>
                <div className="space-y-2">
                  {wasteCategories.map((category) => {
  const isOpen = openCategoryId === category.id;

  return (
    <div
      key={category.id}
      className="border rounded-md overflow-hidden"
    >
      <div
        className="flex items-center justify-between p-4 bg-gray-50 cursor-pointer"
        onClick={() =>
          setOpenCategoryId((prev) => (prev === category.id ? null : category.id))
        }
      >
        <span className="font-medium">{category.title}</span>
        <span className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}>
          <ArrowRight className="h-5 w-5 rotate-90" />
        </span>
      </div>

      {isOpen && (
        <div className="p-4 space-y-3">
          {category.items.map((item, idx) => (
            <div
              key={idx}
              className="border-l-2 border-green-300 pl-3"
            >
              <h4 className="font-medium">{item.name}</h4>
              <p className="text-sm text-gray-600">{item.disposal}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
})}

                </div>
              </Card>
            </div>
          </div>

          {/* Tips Section */}
          <div className="mt-12">
            <Card className="bg-gray-50 p-6 mb-10">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                Waste Sorting Tips
              </h2>
              <div className="space-y-3">
                {tips.map((tip, index) => (
                  <div key={index} className="flex items-start">
                    <div className="flex-shrink-0 text-green-500 mt-0.5">
                      <Check size={20} />
                    </div>
                    <p className="ml-2 text-gray-700">{tip}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Find Recycling Centers */}
          <div className="text-center my-16">
            <p className="text-lg text-gray-700 mb-4">
              Not sure where to dispose of your sorted waste?
            </p>
           <Link to="/user/centres">
  <Button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2">
              Find Recycling Centers Near You
              <MapPin className="ml-2 h-4 w-4" />
            </Button>
</Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-green-800 text-white py-8">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">
                AI Waste Sorting Guide
              </h3>
              <p className="text-green-200">
                Making proper waste disposal easier and more accessible with AI
                technology.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <p className="text-green-200">support@wastesorting.ai</p>
              <p className="text-green-200">+1 (555) 123-4567</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Links</h3>
              <ul className="space-y-2 text-green-200">
                <li>
                  <a href="#" className="hover:text-white">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-green-700 mt-8 pt-8 text-center text-green-300">
            <p>
              &copy; {new Date().getFullYear()} AI Waste Sorting Guide. All
              rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default WasteSorting;
