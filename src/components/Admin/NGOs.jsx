import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDispatch, useSelector } from "react-redux";
import { fetchCenters, updateCenter, deleteCenter, createCenter } from "@/redux/store/recyclingCenterSlice";

const AdminNGOManager = () => {
  const dispatch = useDispatch();
  const { centers=[], loading } = useSelector((state) => state.centers);
  // For editing an existing NGO
  const [editingNGO, setEditingNGO] = useState(null);
  const [form, setForm] = useState({});

  // For creating a new NGO
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newNGO, setNewNGO] = useState({
    name: "",
    address: "",
    phone: "",
    hours: "",
    distance: 0,
    accepts: [],
    coordinates: {
      lat: "",
      lng: ""
    }
  });
  const [geoLoading, setGeoLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchCenters());
  }, [dispatch]);

  const handleUpdate = () => {
    dispatch(updateCenter({ id: editingNGO._id, data: form }));
    setEditingNGO(null);
  };

  const handleDelete = (id) => {
    dispatch(deleteCenter(id));
  };

  const openEditModal = (ngo) => {
    setEditingNGO(ngo);
    setForm({ ...ngo });
  };

  // Function to geocode the address using OpenStreetMap Nominatim API
  const fetchCoordinatesFromAddress = async (address) => {
  try {
    const response = await axios.get(`https://nominatim.openstreetmap.org/search`, {
      params: {
        q: address,
        format: "json",
        limit: 1,
      }
    });

    if (response.data.length > 0) {
      const { lat, lon } = response.data[0];
      return { lat: parseFloat(lat), lng: parseFloat(lon) };
    } else {
      throw new Error("No coordinates found");
    }
  } catch (error) {
    console.error("Error fetching coordinates:", error);
    return null;
  }
};
const handleGetCoordinates = async () => {
  setGeoLoading(true);
  const coords = await fetchCoordinatesFromAddress(newNGO.address);
  setGeoLoading(false);

  if (!coords) return alert("Unable to find location");

  setNewNGO({ ...newNGO, coordinates: coords });
};



  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-slate-100 to-blue-50">
      <div className="max-w-6xl mx-auto">
        {/* Add NGO Button */}
        <div className="flex justify-end mb-4">
          <Button
            onClick={() => setCreateModalOpen(true)}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
          >
            <Plus className="w-4 h-4" /> Add New NGO
          </Button>
        </div>
        {/* NGO List */}
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">NGO Management</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center text-gray-500 py-10">Loading NGOs...</div>
            ) : centers.length === 0 ? (
              <div className="text-center text-gray-500 py-10">No NGOs found.</div>
            ) : (
              <div className="space-y-4">
                {centers.map((ngo) => (
                  <div key={ngo._id} className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-semibold">{ngo.name}</h3>
                      <p className="text-sm text-gray-600">{ngo.address}</p>
                      <p className="text-sm text-gray-600">📞 {ngo.phone}</p>
                      <p className="text-sm text-gray-600">🕒 {ngo.hours}</p>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {ngo.accepts.map((item, i) => (
                          <Badge key={i} variant="secondary">{item}</Badge>
                        ))}
                      </div>
                      <p className="text-sm text-gray-600">
                        Coordinates: {ngo.coordinates.lat}, {ngo.coordinates.lng}
                      </p>
                    </div>
                    <div className="flex space-x-3">
                      <Button variant="outline" onClick={() => openEditModal(ngo)}>
                        <Pencil className="w-4 h-4 mr-2" /> Edit
                      </Button>
                      <Button variant="destructive" className="bg-red-600 text-white" onClick={() => handleDelete(ngo._id)}>
  <Trash2 className="w-4 h-4 mr-2" /> Delete
</Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Create NGO Modal */}
      {createModalOpen && (
        <Dialog open={createModalOpen} onOpenChange={() => setCreateModalOpen(false)}>
          <DialogContent className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full">

            <DialogHeader>
              <DialogTitle>Add New NGO</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Name</Label>
                <Input
                  value={newNGO.name}
                  onChange={(e) => setNewNGO({ ...newNGO, name: e.target.value })}
                />
              </div>
              <div>
                <Label>Address (Location)</Label>
                <Input
                  value={newNGO.address}
                  onChange={(e) => setNewNGO({ ...newNGO, address: e.target.value })}
                />
                <Button
  variant="outline"
  size="sm"
  className="mt-1"
  onClick={handleGetCoordinates}
  disabled={geoLoading || !newNGO.address}
>
  {geoLoading ? "Fetching..." : "Get Coordinates"}
</Button>

              </div>
              <div>
                <Label>Phone</Label>
                <Input
                  value={newNGO.phone}
                  onChange={(e) => setNewNGO({ ...newNGO, phone: e.target.value })}
                />
              </div>
              <div>
                <Label>Hours</Label>
                <Input
                  value={newNGO.hours}
                  onChange={(e) => setNewNGO({ ...newNGO, hours: e.target.value })}
                />
              </div>
              <div>
                <Label>Distance (in km)</Label>
                <Input
                  type="number"
                  value={newNGO.distance}
                  onChange={(e) => setNewNGO({ ...newNGO, distance: Number(e.target.value) })}
                />
              </div>
              <div>
                <Label>Waste Accepted (comma separated)</Label>
                <Input
                  value={newNGO.accepts.join(", ")}
                  onChange={(e) =>
                    setNewNGO({
                      ...newNGO,
                      accepts: e.target.value.split(",").map((a) => a.trim())
                    })
                  }
                />
              </div>
              <div className="flex gap-4">
                <div>
                  <Label>Latitude</Label>
                  <Input type="number" value={newNGO.coordinates.lat} readOnly />
                </div>
                <div>
                  <Label>Longitude</Label>
                  <Input type="number" value={newNGO.coordinates.lng} readOnly />
                </div>
              </div>
              <Button
                onClick={() => {
                  dispatch(createCenter(newNGO));
                  setCreateModalOpen(false);
                  setNewNGO({
                    name: "",
                    address: "",
                    phone: "",
                    hours: "",
                    distance: 0,
                    accepts: [],
                    coordinates: { lat: "", lng: "" }
                  });
                }}
                className="w-full bg-green-600 text-white mt-4"
              >
                Add NGO
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Edit NGO Modal */}
      {editingNGO && (
        <Dialog open={!!editingNGO} onOpenChange={() => setEditingNGO(null)}>
          <DialogContent className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full">

            <DialogHeader>
              <DialogTitle>Edit NGO Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Name</Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div>
                <Label>Address</Label>
                <Input
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                />
              </div>
              <div>
                <Label>Phone</Label>
                <Input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>
              <div>
                <Label>Hours</Label>
                <Input
                  value={form.hours}
                  onChange={(e) => setForm({ ...form, hours: e.target.value })}
                />
              </div>
              <Button onClick={handleUpdate} className="w-full bg-blue-600 text-white mt-4">
                Save Changes
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default AdminNGOManager;
