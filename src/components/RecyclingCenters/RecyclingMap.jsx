import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import { Select, SelectTrigger,
  SelectValue, SelectContent, SelectItem
} from '@/components/ui/select';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { MapPin, Search, Filter, Clock, Phone, Map, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { Leaf } from 'lucide-react';
const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN;
mapboxgl.accessToken = mapboxToken;
 

// List of waste types and their labels
const wasteTypes = [
  { value: "plastic", label: "Plastic" },
  { value: "paper", label: "Paper" },
  { value: "glass", label: "Glass" },
  { value: "metal", label: "Metal" },
  { value: "electronics", label: "Electronics" },
  { value: "batteries", label: "Batteries" },
  { value: "hazardous", label: "Hazardous Waste" },
  { value: "organic", label: "Organic/Compost" },
  { value: "textiles", label: "Textiles/Clothing" },
  { value: "appliances", label: "Appliances" }
];


const RecyclingCenters = () => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [userCoords, setUserCoords] = useState(null);
  const [centers, setCenters] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [selectedWasteType, setSelectedWasteType] = useState('');
  const [maxDistance, setMaxDistance] = useState('10');
  const [openOnly, setOpenOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  

  useEffect(() => {
  const fetchCentersFromBackend = async () => {
    try {
      // ✅ Correct
const response = await fetch("http://localhost:5000/ngos");


      const data = await response.json();
      setCenters(data);
      setFiltered(data); // Set filtered initially to full list
    } catch (err) {
      console.error("Error fetching centers from backend:", err);
    }
  };

  fetchCentersFromBackend();
  initializeMap([77.209, 28.613]);
}, []);

  const initializeMap = (center = [77.209, 28.613]) => {
  if (mapRef.current) return;

  mapRef.current = new mapboxgl.Map({
    container: mapContainerRef.current,
    style: 'mapbox://styles/mapbox/streets-v11',
    center: center,
    zoom: 10,
  });

  // Add navigation controls
  mapRef.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

  // Add geocoder control
  const geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    mapboxgl: mapboxgl,
    marker: false,
  });

  mapRef.current.addControl(geocoder);
};
const addMarkers = () => {
  if (!mapRef.current || !filtered.length) return;

  // Clear previous markers if needed
  const markers = document.getElementsByClassName('mapboxgl-marker');
  while (markers.length > 0) {
    markers[0].remove();
  }

  filtered.forEach(center => {
    const el = document.createElement('div');
    el.className = 'marker';
    el.style.width = '24px';
    el.style.height = '24px';
    el.style.backgroundImage = "url('https://cdn-icons-png.flaticon.com/512/684/684908.png')";
    el.style.backgroundSize = 'cover';
    el.style.borderRadius = '50%';
    el.style.cursor = 'pointer';

    const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
      <h3>${center.name}</h3>
      <p>${center.address}</p>
    `);

    new mapboxgl.Marker(el)
      .setLngLat([center.coordinates.lng, center.coordinates.lat])
      .setPopup(popup)
      .addTo(mapRef.current);
  });
};

  

  const handleGetCurrentLocation = async () => {
  navigator.geolocation.getCurrentPosition(
  async (pos) => {
    const lat = pos.coords.latitude;
    const lng = pos.coords.longitude;
    setUserCoords({ lat, lng });
    if (mapRef.current) {
      mapRef.current.flyTo({ center: [lng, lat], zoom: 13 });
    }

    // Call backend API to get centers
    try {
      const response = await fetch(
  `http://localhost:5000/ngos/nearby?lat=${lat}&lng=${lng}&distance=${maxDistance}`

      );
      const data = await response.json();
      setFiltered(data);
      toast.success(`Found ${data.length} centers near you`);
    } catch (err) {
      toast.error("Failed to fetch nearby centers");
    }
  },
  (err) => {
    console.error("Geolocation error:", err);
    alert("Failed to get your current location.");
  },
  {
    enableHighAccuracy: true,
    timeout: 15000, // 15 seconds
    maximumAge: 0,  // Don't use cached position
  }
);

};

  const handleSearch = async () => {
  if (!searchTerm) return;

  try {
    // 1. Get coordinates from Mapbox Geocoding API
    const geoResponse = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchTerm)}.json?access_token=${mapboxToken}`
    );
    const geoData = await geoResponse.json();

    if (!geoData.features.length) {
      toast.error("No location found.");
      return;
    }

    const [lng, lat] = geoData.features[0].center;
    console.log("lng:",lng);
    console.log("lat",lat);
    setUserCoords({ lat, lng });

    // 2. Fly map to new location
    mapRef.current?.flyTo({ center: [lng, lat], zoom: 12 });

    // 3. Send coordinates to backend
    const backendResponse = await fetch(
  `http://localhost:5000/ngos/nearby?lat=${lat}&lng=${lng}&distance=${maxDistance}`
);

    const data = await backendResponse.json();

    setFiltered(data);
    toast.success(`Found ${data.length} centers near "${searchTerm}"`);
  } catch (err) {
    console.error("Search failed:", err);
    toast.error("Search failed");
  }
};


  useEffect(() => {
    initializeMap([77.209, 28.613]); // Delhi default
  }, []);

  useEffect(() => {
    addMarkers();
  }, [filtered]);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="pt-4 px-10">
        <Link to="/user/dashboard" className="flex items-center text-green-800 font-bold text-xl">
          <Leaf size={28} className="mr-2" />
          RecycleConnect
        </Link>
      </div>
      <main className="flex-grow pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold mb-4 text-transparent bg-clip-text"
                style={{ backgroundImage: 'linear-gradient(to right, #15803d, #0369a1)' }}>
              Find Recycling Centers
            </h1>
            <p className="text-foreground/70 max-w-2xl mx-auto">
              Locate recycling and waste disposal facilities near you.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
            <div className="flex flex-col md:flex-row md:items-end gap-4">
              <div className="flex-grow space-y-2">
                <Label htmlFor="location">Location</Label>
                <div className="flex">
                  <Input
                    id="location"
                    placeholder="Enter address or city"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-grow"
                  />
                  <Button type="button" variant="outline" className="ml-2 flex-shrink-0"
                          onClick={handleGetCurrentLocation}>
                    <MapPin size={18} className="mr-2" />
                    <span className="hidden sm:inline">Use Current</span>
                  </Button>
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSearch} className="h-10">
                  <Search size={18} className="mr-2" />
                  Search
                </Button>
                {/* <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="h-10">
                  <Filter size={18} className="mr-2" />
                  Filters
                </Button> */}
              </div>
            </div>

            {showFilters && (
              <div className="mt-6 pt-4 border-t grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="waste-type">Type of Waste</Label>
                  <Select value={selectedWasteType} onValueChange={setSelectedWasteType}>
                    <SelectTrigger id="waste-type">
                      <SelectValue placeholder="All waste types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All waste types</SelectItem>
                      {wasteTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="distance">Maximum Distance</Label>
                  <Select value={maxDistance} onValueChange={setMaxDistance}>
                    <SelectTrigger id="distance">
                      <SelectValue placeholder="Select distance" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">Within 5 miles</SelectItem>
                      <SelectItem value="10">Within 10 miles</SelectItem>
                      <SelectItem value="25">Within 25 miles</SelectItem>
                      <SelectItem value="50">Within 50 miles</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2 md:mt-8">
                  <Checkbox id="open-now" checked={openOnly} onCheckedChange={setOpenOnly} />
                  <Label htmlFor="open-now" className="cursor-pointer">Show open centers only</Label>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 order-2 lg:order-1 space-y-6">
              {filtered.length ? filtered.map((center) => (
                <div key={center._id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                  <h3 className="text-lg font-semibold mb-1">{center.name}</h3>
                  <div className="text-sm text-foreground/70 mb-3">{center.distance || 'Nearby'}</div>
                  <div className="text-sm text-foreground/70 mb-1">{center.address}</div>
                  <div className="text-sm text-foreground/70 mb-1">{center.phone}</div>
                  <div className="text-sm text-foreground/70 mb-2">{center.hours}</div>
                  <div className="flex flex-wrap gap-2">
                    {center.accepts?.map((type) => (
                      <span key={type} className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        {wasteTypes.find(w => w.value === type)?.label || type}
                      </span>
                    ))}
                  </div>
                </div>
              )) : (
                <div className="text-center p-8 bg-gray-50 rounded-lg">
                  <div className="text-4xl mb-4">🔍</div>
                  <h3 className="text-lg font-medium mb-2">No centers found</h3>
                  <Button onClick={() => setFiltered(centers)}>Reset Filters</Button>
                </div>
              )}
            </div>

            <div className="lg:col-span-2 order-1 lg:order-2">
              <div className="bg-gray-100 rounded-xl overflow-hidden h-[500px] relative">
              <div
  ref={mapContainerRef}
  className="absolute inset-0 z-0"
  style={{ height: "100%", minHeight: "500px" }}
/>

              </div>
            </div>
          </div>
        </div>
      </main>
      {/* <Footer /> */}
    </div>
  );
};

export default RecyclingCenters;