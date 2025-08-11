import React, { useState } from 'react';
import { Users, Calendar, Award, Search, Filter, Plus, Video, Play, Trash2, Clock, UserPlus } from 'lucide-react';
import { motion } from "framer-motion";
import { useAuth } from "../../contexts/AuthContext";
import { mockClubs } from "../../data/mockData";
import toast from "react-hot-toast";

export function Clubs() {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [clubs, setClubs] = useState(mockClubs);
  const [showNewClubForm, setShowNewClubForm] = useState(false);
  const [showLiveStream, setShowLiveStream] = useState(false);
  const [selectedClubForStream, setSelectedClubForStream] = useState(null);
  const [liveStreams, setLiveStreams] = useState({});
  const [joinRequests, setJoinRequests] = useState({});

  const [newClub, setNewClub] = useState({
    name: '',
    category: 'Academic',
    description: '',
    image: '',
    video: ''
  });

  const [streamSettings, setStreamSettings] = useState({
    title: '',
    description: '',
    duration: 60,
    scheduledTime: ''
  });

  const categories = ['All', 'Academic', 'Sports', 'Cultural', 'Technology', 'Service', 'Arts'];

  const filteredClubs = clubs.filter(club => {
    const matchesCategory = selectedCategory === 'All' || club.category === selectedCategory;
    const matchesSearch = club.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         club.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleJoinClub = (clubId) => {
    if (!user) {
      toast.error("Please login to join clubs");
      return;
    }

    // Add to join requests
    setJoinRequests(prev => ({
      ...prev,
      [clubId]: [...(prev[clubId] || []), {
        id: user.id,
        name: user.name,
        email: user.email,
        requestedAt: new Date()
      }]
    }));

    toast.success("Join request sent! Waiting for admin approval.");
  };

  const handleApproveJoinRequest = (clubId, userId) => {
    if (!user?.isAdmin) {
      toast.error("Only admins can approve join requests");
      return;
    }

    // Remove from requests and add to club members
    setJoinRequests(prev => ({
      ...prev,
      [clubId]: (prev[clubId] || []).filter(req => req.id !== userId)
    }));

    setClubs(clubs.map(club => 
      club.id === clubId 
        ? { ...club, members: club.members + 1 }
        : club
    ));

    toast.success("Member approved successfully!");
  };

  const handleCreateClub = (e) => {
    e.preventDefault();
    if (!user?.isAdmin) {
      toast.error("Only admins can create clubs");
      return;
    }

    const club = {
      id: `club_${Date.now()}`,
      ...newClub,
      members: 1,
      events: 0,
      founded: new Date().getFullYear().toString(),
      status: 'active',
      image: newClub.image || 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400'
    };

    setClubs([...clubs, club]);
    setNewClub({ name: '', category: 'Academic', description: '', image: '', video: '' });
    setShowNewClubForm(false);
    toast.success("Club created successfully!");
  };

  const handleDeleteClub = (clubId) => {
    if (!user?.isAdmin) {
      toast.error("Only admins can delete clubs");
      return;
    }
    
    setClubs(clubs.filter(club => club.id !== clubId));
    toast.success("Club deleted successfully!");
  };

  const handleStartLiveStream = (clubId) => {
    if (!user?.isAdmin) {
      toast.error("Only admins can start live streams");
      return;
    }

    if (!streamSettings.title || !streamSettings.duration) {
      toast.error("Please fill all stream settings");
      return;
    }

    const streamId = `stream_${Date.now()}`;
    const stream = {
      id: streamId,
      clubId,
      ...streamSettings,
      startTime: new Date(),
      endTime: new Date(Date.now() + streamSettings.duration * 60000),
      isLive: true,
      viewers: 0
    };

    setLiveStreams(prev => ({
      ...prev,
      [clubId]: stream
    }));

    setShowLiveStream(false);
    setStreamSettings({ title: '', description: '', duration: 60, scheduledTime: '' });
    toast.success("Live stream started!");

    // Auto-end stream after duration
    setTimeout(() => {
      setLiveStreams(prev => ({
        ...prev,
        [clubId]: { ...prev[clubId], isLive: false }
      }));
      toast.info("Live stream ended");
    }, streamSettings.duration * 60000);
  };

  const handleEndLiveStream = (clubId) => {
    if (!user?.isAdmin) {
      toast.error("Only admins can end live streams");
      return;
    }

    setLiveStreams(prev => ({
      ...prev,
      [clubId]: { ...prev[clubId], isLive: false }
    }));

    toast.success("Live stream ended");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Student Clubs</h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-4xl mx-auto">
              Join one of our many student clubs and organizations to pursue your interests, 
              develop new skills, and connect with like-minded peers.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Admin Controls */}
        {user?.isAdmin && (
          <div className="mb-8 bg-white rounded-xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Admin Controls</h2>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowLiveStream(true)}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center"
                >
                  <Video className="w-4 h-4 mr-2" />
                  Start Live Stream
                </button>
                <button
                  onClick={() => setShowNewClubForm(!showNewClubForm)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create New Club
                </button>
              </div>
            </div>

            {showNewClubForm && (
              <form onSubmit={handleCreateClub} className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Club Name"
                  value={newClub.name}
                  onChange={(e) => setNewClub({...newClub, name: e.target.value})}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
                <select
                  value={newClub.category}
                  onChange={(e) => setNewClub({...newClub, category: e.target.value})}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  {categories.filter(cat => cat !== 'All').map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <textarea
                  placeholder="Club Description"
                  value={newClub.description}
                  onChange={(e) => setNewClub({...newClub, description: e.target.value})}
                  className="md:col-span-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  required
                />
                <input
                  type="url"
                  placeholder="Club Image URL (optional)"
                  value={newClub.image}
                  onChange={(e) => setNewClub({...newClub, image: e.target.value})}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="url"
                  placeholder="Club Video URL (optional)"
                  value={newClub.video}
                  onChange={(e) => setNewClub({...newClub, video: e.target.value})}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <div className="md:col-span-2 flex gap-4">
                  <button
                    type="submit"
                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Create Club
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowNewClubForm(false)}
                    className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {/* Join Requests Management */}
            {Object.keys(joinRequests).length > 0 && (
              <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Pending Join Requests</h3>
                <div className="space-y-3">
                  {Object.entries(joinRequests).map(([clubId, requests]) => {
                    const club = clubs.find(c => c.id === clubId);
                    return requests.map(request => (
                      <div key={`${clubId}-${request.id}`} className="flex items-center justify-between bg-white p-3 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{request.name}</p>
                          <p className="text-sm text-gray-600">wants to join {club?.name}</p>
                          <p className="text-xs text-gray-500">{request.requestedAt.toLocaleDateString()}</p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleApproveJoinRequest(clubId, request.id)}
                            className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => setJoinRequests(prev => ({
                              ...prev,
                              [clubId]: prev[clubId].filter(req => req.id !== request.id)
                            }))}
                            className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    ));
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Search and Filter */}
        <div className="mb-8 lg:mb-12">
          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search clubs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2 mb-6">
            <Filter className="w-5 h-5 text-gray-500" />
            <span className="text-gray-700 font-medium">Filter by category:</span>
          </div>
          
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredClubs.length} of {clubs.length} clubs
            {selectedCategory !== 'All' && ` in ${selectedCategory}`}
            {searchTerm && ` matching "${searchTerm}"`}
          </p>
        </div>

        {/* Clubs Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-16">
          {filteredClubs.map((club, index) => (
            <div key={club.id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
              <div className="relative">
                <img
                  src={club.image}
                  alt={club.name}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full font-medium">
                    {club.category}
                  </span>
                </div>
                
                {/* Live Stream Indicator */}
                {liveStreams[club.id]?.isLive && (
                  <div className="absolute top-4 right-4 bg-red-600 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
                    <div className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse"></div>
                    LIVE
                  </div>
                )}

                {/* Video Play Button */}
                {club.video && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button className="bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-all">
                      <Play className="w-6 h-6" />
                    </button>
                  </div>
                )}

                {user?.isAdmin && (
                  <div className="absolute top-4 right-4 flex space-x-2">
                    {liveStreams[club.id]?.isLive ? (
                      <button
                        onClick={() => handleEndLiveStream(club.id)}
                        className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors"
                      >
                        <Video className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setSelectedClubForStream(club.id);
                          setShowLiveStream(true);
                        }}
                        className="bg-green-600 text-white p-2 rounded-full hover:bg-green-700 transition-colors"
                      >
                        <Video className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteClub(club.id)}
                      className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {club.name}
                  </h3>
                  <span className="text-gray-500 text-sm">
                    Est. {club.founded}
                  </span>
                </div>
                
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                  {club.description}
                </p>

                {/* Live Stream Info */}
                {liveStreams[club.id] && (
                  <div className="mb-4 p-3 bg-red-50 rounded-lg border border-red-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-red-800">{liveStreams[club.id].title}</p>
                        <p className="text-sm text-red-600">
                          {liveStreams[club.id].isLive ? 'Live Now' : 'Stream Ended'}
                        </p>
                      </div>
                      {liveStreams[club.id].isLive && (
                        <button className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors">
                          Join Live
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Stats */}
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    <span>{club.members} members</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>{club.events} events/year</span>
                  </div>
                  {joinRequests[club.id]?.length > 0 && (
                    <div className="flex items-center">
                      <UserPlus className="w-4 h-4 mr-1" />
                      <span>{joinRequests[club.id].length} pending</span>
                    </div>
                  )}
                </div>
                
                <button 
                  onClick={() => handleJoinClub(club.id)}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Request to Join
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredClubs.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No clubs found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search terms or category filter
            </p>
            <button
              onClick={() => {
                setSearchTerm('')
                setSelectedCategory('All')
              }}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear filters
            </button>
          </div>
        )}

        {/* Live Stream Setup Modal */}
        {showLiveStream && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl max-w-md w-full"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    Start Live Stream
                  </h2>
                  <button
                    onClick={() => setShowLiveStream(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Stream Title
                    </label>
                    <input
                      type="text"
                      value={streamSettings.title}
                      onChange={(e) => setStreamSettings({...streamSettings, title: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter stream title"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={streamSettings.description}
                      onChange={(e) => setStreamSettings({...streamSettings, description: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      rows="3"
                      placeholder="Stream description"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Duration (minutes)
                    </label>
                    <input
                      type="number"
                      value={streamSettings.duration}
                      onChange={(e) => setStreamSettings({...streamSettings, duration: parseInt(e.target.value)})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      min="1"
                      max="180"
                    />
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => setShowLiveStream(false)}
                      className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleStartLiveStream(selectedClubForStream)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      Start Stream
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Create Club CTA */}
        <div className="bg-gradient-to-r from-green-600 to-green-800 rounded-2xl p-6 lg:p-8 text-center text-white">
          <div className="max-w-2xl mx-auto">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8" />
            </div>
            <h2 className="text-2xl lg:text-3xl font-bold mb-4">
              Want to Start a New Club?
            </h2>
            <p className="text-green-100 mb-6 text-lg">
              Have an idea for a new club or organization? We support student initiatives 
              and can help you get started with the registration process.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Start a Club
              </button>
              <button className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}