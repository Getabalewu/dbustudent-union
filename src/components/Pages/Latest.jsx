import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../contexts/AuthContext";
import { Trash2, Plus, Upload, X, Image as ImageIcon } from "lucide-react";
import toast from "react-hot-toast";

export function Latest() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("news");
  const [posts, setPosts] = useState([
    {
      id: 1,
      type: "news",
      title: "New Student Lounge Opening",
      date: "2023-10-15",
      content:
        "The new student lounge in Block B will officially open next Monday with free coffee for all students.",
      image: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800",
      category: "Campus",
    },
    {
      id: 2,
      type: "event",
      title: "Annual Cultural Festival",
      date: "2023-11-20",
      content:
        "Join us for our annual cultural festival featuring performances, food, and traditional exhibitions.",
      location: "Main Auditorium",
      time: "3:00 PM",
      image: "https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=800",
    },
    {
      id: 3,
      type: "announcement",
      title: "Semester Break Schedule",
      date: "2023-12-10",
      content:
        "All classes will be suspended from December 15th to January 8th for semester break.",
      important: true,
      image: null,
    },
  ]);

  const [newPost, setNewPost] = useState({
    type: "news",
    title: "",
    content: "",
    date: new Date().toISOString().split("T")[0],
    category: "General",
    image: null,
    location: "",
    time: "",
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [showImageUpload, setShowImageUpload] = useState(false);

  const filteredPosts = posts.filter((post) => post.type === activeTab);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error("Image size should be less than 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setNewPost({ ...newPost, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUrl = (url) => {
    if (url) {
      setImagePreview(url);
      setNewPost({ ...newPost, image: url });
      setShowImageUpload(false);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setNewPost({ ...newPost, image: null });
    setShowImageUpload(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!user?.isAdmin) {
      toast.error("Only admins can create posts");
      return;
    }

    const postToAdd = {
      ...newPost,
      id: posts.length + 1,
      important: newPost.type === "announcement" && newPost.important,
      location: newPost.type === "event" ? newPost.location : "",
      time: newPost.type === "event" ? newPost.time : "",
    };

    setPosts([postToAdd, ...posts]);
    setNewPost({
      type: "news",
      title: "",
      content: "",
      date: new Date().toISOString().split("T")[0],
      category: "General",
      image: null,
      location: "",
      time: "",
    });
    setImagePreview(null);
    setShowImageUpload(false);
    toast.success("Post created successfully!");
  };

  const handleDeletePost = (postId) => {
    if (!user?.isAdmin) {
      toast.error("Only admins can delete posts");
      return;
    }
    
    setPosts(posts.filter(post => post.id !== postId));
    toast.success("Post deleted successfully!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100">
      {/* Header */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Latest Updates</h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-4xl mx-auto">
              Stay updated with the latest news, events, and announcements from
              the Student Union of Debre Berhan University
            </p>
          </motion.div>
        </div>
      </section>
      
      <div className="container mx-auto py-8 px-4 max-w-6xl">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Tabs Navigation */}
          <div className="flex border-b bg-gray-50">
            <button
              onClick={() => setActiveTab("news")}
              className={`px-6 py-4 font-medium text-lg flex-1 text-center transition-all ${
                activeTab === "news"
                  ? "text-blue-600 border-b-2 border-blue-600 bg-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              📰 News
            </button>
            <button
              onClick={() => setActiveTab("event")}
              className={`px-6 py-4 font-medium text-lg flex-1 text-center transition-all ${
                activeTab === "event"
                  ? "text-blue-600 border-b-2 border-blue-600 bg-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              📅 Events
            </button>
            <button
              onClick={() => setActiveTab("announcement")}
              className={`px-6 py-4 font-medium text-lg flex-1 text-center transition-all ${
                activeTab === "announcement"
                  ? "text-blue-600 border-b-2 border-blue-600 bg-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              📢 Announcements
            </button>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Posts Column */}
              <div className="lg:col-span-2">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  {activeTab === "news" && "Latest Campus News"}
                  {activeTab === "event" && "Upcoming Events"}
                  {activeTab === "announcement" && "Important Announcements"}
                </h2>

                <div className="space-y-6">
                  {filteredPosts.length > 0 ? (
                    filteredPosts.map((post) => (
                      <PostCard 
                        key={post.id} 
                        post={post} 
                        onDelete={handleDeletePost}
                        canDelete={user?.isAdmin}
                      />
                    ))
                  ) : (
                    <div className="bg-blue-50 rounded-xl p-8 text-center">
                      <div className="text-4xl text-blue-500 mb-4">📥</div>
                      <h3 className="text-xl font-semibold text-gray-700">
                        No posts yet
                      </h3>
                      <p className="text-gray-600 mt-2">
                        {activeTab === "news" &&
                          "Be the first to share campus news!"}
                        {activeTab === "event" &&
                          "No upcoming events scheduled yet."}
                        {activeTab === "announcement" &&
                          "No announcements at this time."}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Admin Panel */}
              {user?.isAdmin && (
                <div className="bg-gradient-to-br from-gray-50 to-blue-50 p-6 rounded-xl border border-gray-200">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-800">
                      Create New Post
                    </h3>
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <Plus className="w-4 h-4 text-blue-600" />
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-gray-700 mb-2 font-medium">
                        Post Type
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          type="button"
                          onClick={() => setNewPost({ ...newPost, type: "news" })}
                          className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                            newPost.type === "news"
                              ? "bg-blue-600 text-white shadow-md"
                              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                          }`}
                        >
                          News
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setNewPost({ ...newPost, type: "event" })
                          }
                          className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                            newPost.type === "event"
                              ? "bg-blue-600 text-white shadow-md"
                              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                          }`}
                        >
                          Event
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setNewPost({ ...newPost, type: "announcement" })
                          }
                          className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                            newPost.type === "announcement"
                              ? "bg-blue-600 text-white shadow-md"
                              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                          }`}
                        >
                          Announcement
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-700 mb-2 font-medium">
                        Title
                      </label>
                      <input
                        type="text"
                        value={newPost.title}
                        onChange={(e) =>
                          setNewPost({ ...newPost, title: e.target.value })
                        }
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="Enter post title"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 mb-2 font-medium">
                        Content
                      </label>
                      <textarea
                        value={newPost.content}
                        onChange={(e) =>
                          setNewPost({ ...newPost, content: e.target.value })
                        }
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-32 transition-colors"
                        placeholder="Enter post content"
                        required
                      ></textarea>
                    </div>

                    <div>
                      <label className="block text-gray-700 mb-2 font-medium">
                        Date
                      </label>
                      <input
                        type="date"
                        value={newPost.date}
                        onChange={(e) =>
                          setNewPost({ ...newPost, date: e.target.value })
                        }
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        required
                      />
                    </div>

                    {newPost.type === "news" && (
                      <div>
                        <label className="block text-gray-700 mb-2 font-medium">
                          Category
                        </label>
                        <select
                          value={newPost.category}
                          onChange={(e) =>
                            setNewPost({ ...newPost, category: e.target.value })
                          }
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        >
                          <option value="General">General</option>
                          <option value="Campus">Campus</option>
                          <option value="Academic">Academic</option>
                          <option value="Sports">Sports</option>
                          <option value="Research">Research</option>
                        </select>
                      </div>
                    )}

                    {newPost.type === "event" && (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-gray-700 mb-2 font-medium">
                            Location
                          </label>
                          <input
                            type="text"
                            value={newPost.location}
                            onChange={(e) =>
                              setNewPost({ ...newPost, location: e.target.value })
                            }
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            placeholder="Event location"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-gray-700 mb-2 font-medium">
                            Time
                          </label>
                          <input
                            type="text"
                            value={newPost.time}
                            onChange={(e) =>
                              setNewPost({ ...newPost, time: e.target.value })
                            }
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            placeholder="Event time"
                            required
                          />
                        </div>
                      </div>
                    )}

                    {newPost.type === "announcement" && (
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="important"
                          checked={newPost.important}
                          onChange={(e) =>
                            setNewPost({
                              ...newPost,
                              important: e.target.checked,
                            })
                          }
                          className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <label
                          htmlFor="important"
                          className="ml-2 text-gray-700 font-medium"
                        >
                          Mark as Important Announcement
                        </label>
                      </div>
                    )}

                    {/* Enhanced Image Upload Section */}
                    <div>
                      <label className="block text-gray-700 mb-2 font-medium">
                        Add Image
                      </label>
                      
                      {!imagePreview ? (
                        <div className="space-y-3">
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => setShowImageUpload(!showImageUpload)}
                              className="flex-1 bg-blue-100 text-blue-700 py-2 px-4 rounded-lg hover:bg-blue-200 transition-colors flex items-center justify-center"
                            >
                              <ImageIcon className="w-4 h-4 mr-2" />
                              Add Image
                            </button>
                          </div>

                          {showImageUpload && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              className="space-y-3 p-4 bg-gray-50 rounded-lg"
                            >
                              {/* File Upload */}
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Upload from Device
                                </label>
                                <div className="flex items-center justify-center w-full">
                                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-white hover:bg-gray-50 transition-colors">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                      <Upload className="w-8 h-8 text-gray-400 mb-2" />
                                      <p className="text-sm text-gray-500">
                                        <span className="font-semibold">Click to upload</span> or drag and drop
                                      </p>
                                      <p className="text-xs text-gray-500">PNG, JPG (MAX. 5MB)</p>
                                    </div>
                                    <input
                                      type="file"
                                      className="hidden"
                                      onChange={handleImageChange}
                                      accept="image/*"
                                    />
                                  </label>
                                </div>
                              </div>

                              {/* URL Input */}
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Or Enter Image URL
                                </label>
                                <div className="flex gap-2">
                                  <input
                                    type="url"
                                    placeholder="https://example.com/image.jpg"
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    onKeyPress={(e) => {
                                      if (e.key === 'Enter') {
                                        e.preventDefault();
                                        handleImageUrl(e.target.value);
                                      }
                                    }}
                                  />
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      const input = e.target.previousElementSibling;
                                      handleImageUrl(input.value);
                                    }}
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                  >
                                    Add
                                  </button>
                                </div>
                              </div>

                              <button
                                type="button"
                                onClick={() => setShowImageUpload(false)}
                                className="w-full text-gray-600 hover:text-gray-800 py-2"
                              >
                                Cancel
                              </button>
                            </motion.div>
                          )}
                        </div>
                      ) : (
                        <div className="relative">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-full h-48 object-cover rounded-lg border border-gray-300"
                          />
                          <button
                            type="button"
                            onClick={removeImage}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-3 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-800 transition-all shadow-lg hover:shadow-xl"
                    >
                      Publish Post
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-gray-600">
          <p>
            © {new Date().getFullYear()} Debre Berhan University Student Union
          </p>
        </div>
      </div>
    </div>
  );
}

// Enhanced Post Card Component
function PostCard({ post, onDelete, canDelete }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-xl shadow-md overflow-hidden border transition-all hover:shadow-lg ${
        post.important ? "border-l-4 border-red-500" : "border-gray-200"
      }`}
    >
      {/* Image */}
      {post.image && (
        <div className="relative">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-64 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        </div>
      )}

      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center flex-wrap gap-2">
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                post.type === "news"
                  ? "bg-blue-100 text-blue-800"
                  : post.type === "event"
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {post.type === "news" ? "📰" : post.type === "event" ? "📅" : "📢"}
              <span className="ml-1">
                {post.type.charAt(0).toUpperCase() + post.type.slice(1)}
              </span>
            </span>
            {post.category && (
              <span className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                🏷️ {post.category}
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-gray-500 text-sm">{post.date}</span>
            {canDelete && (
              <button
                onClick={() => onDelete(post.id)}
                className="text-red-600 hover:text-red-700 p-1 hover:bg-red-50 rounded transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-3">{post.title}</h3>

        <p className="text-gray-600 mb-4 leading-relaxed">{post.content}</p>

        {post.type === "event" && (
          <div className="bg-gradient-to-r from-blue-50 to-green-50 p-4 rounded-lg border border-blue-100 mb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-center">
                <div className="bg-blue-100 p-2 rounded-lg mr-3">
                  📍
                </div>
                <div>
                  <p className="text-sm text-gray-600">Location</p>
                  <p className="font-medium text-gray-900">{post.location}</p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="bg-green-100 p-2 rounded-lg mr-3">
                  🕐
                </div>
                <div>
                  <p className="text-sm text-gray-600">Time</p>
                  <p className="font-medium text-gray-900">{post.time}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {post.important && (
          <div className="mt-4 bg-red-50 p-3 rounded-lg border-l-4 border-red-500">
            <div className="flex items-center">
              <span className="text-red-500 mr-2">⚠️</span>
              <p className="font-medium text-red-800">Important Announcement</p>
            </div>
          </div>
        )}

        <div className="mt-6 flex justify-between items-center pt-4 border-t border-gray-100">
          <div className="flex space-x-4">
            <button className="text-gray-500 hover:text-blue-600 transition-colors flex items-center space-x-1">
              <span>👍</span>
              <span className="text-sm">Like</span>
            </button>
            <button className="text-gray-500 hover:text-blue-600 transition-colors flex items-center space-x-1">
              <span>📤</span>
              <span className="text-sm">Share</span>
            </button>
            <button className="text-gray-500 hover:text-blue-600 transition-colors flex items-center space-x-1">
              <span>🔖</span>
              <span className="text-sm">Save</span>
            </button>
          </div>
          <div className="text-gray-500 text-sm flex items-center">
            <span>👁️</span>
            <span className="ml-1">245 views</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}