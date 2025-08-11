import React, { useState } from "react";
import {
  Vote,
  Users,
  Clock,
  CheckCircle,
  Calendar,
  Eye,
  BarChart3,
  Plus,
  Trash2,
  UserPlus,
  Search,
  Filter,
} from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "../../contexts/AuthContext";
import { mockElections } from "../../data/mockData";
import toast from "react-hot-toast";

export function Elections() {
  const { user } = useAuth();
  const [selectedTab, setSelectedTab] = useState("all");
  const [selectedElection, setSelectedElection] = useState(null);
  const [elections, setElections] = useState(mockElections);
  const [votedElections, setVotedElections] = useState(new Set());
  const [showNewElectionForm, setShowNewElectionForm] = useState(false);
  const [showVoterRegistration, setShowVoterRegistration] = useState(false);
  const [selectedElectionForVoters, setSelectedElectionForVoters] = useState(null);
  const [voterSearchTerm, setVoterSearchTerm] = useState("");
  const [registeredVoters, setRegisteredVoters] = useState({});

  const [newElection, setNewElection] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    candidates: []
  });

  const [newCandidate, setNewCandidate] = useState({
    name: '',
    position: '',
    platform: '',
    profileImage: ''
  });

  const [mockStudents] = useState([
    { id: 'student_1', name: 'John Doe', email: 'john@dbu.edu.et', studentId: 'DBU-2021-001' },
    { id: 'student_2', name: 'Jane Smith', email: 'jane@dbu.edu.et', studentId: 'DBU-2021-002' },
    { id: 'student_3', name: 'Mike Johnson', email: 'mike@dbu.edu.et', studentId: 'DBU-2021-003' },
    { id: 'student_4', name: 'Sarah Wilson', email: 'sarah@dbu.edu.et', studentId: 'DBU-2021-004' },
    { id: 'student_5', name: 'David Brown', email: 'david@dbu.edu.et', studentId: 'DBU-2021-005' },
  ]);

  const filteredElections = elections.filter(
    (election) => selectedTab === "all" || election.status === selectedTab
  );

  const filteredStudents = mockStudents.filter(student =>
    student.name.toLowerCase().includes(voterSearchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(voterSearchTerm.toLowerCase()) ||
    student.studentId.toLowerCase().includes(voterSearchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "upcoming":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "active":
        return <Vote className="w-4 h-4" />;
      case "upcoming":
        return <Clock className="w-4 h-4" />;
      case "completed":
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Calendar className="w-4 h-4" />;
    }
  };

  const handleVote = (electionId, candidateId) => {
    if (!user) {
      toast.error("Please login to vote");
      return;
    }

    if (votedElections.has(electionId)) {
      toast.error("You have already voted in this election");
      return;
    }

    // Check if user is registered for this election
    const electionVoters = registeredVoters[electionId] || [];
    if (!electionVoters.includes(user.id)) {
      toast.error("You are not registered to vote in this election");
      return;
    }

    // Update vote count
    setElections(elections.map(election => {
      if (election.id === electionId) {
        return {
          ...election,
          totalVotes: election.totalVotes + 1,
          candidates: election.candidates.map(candidate => 
            candidate.id === candidateId 
              ? { ...candidate, votes: candidate.votes + 1 }
              : candidate
          )
        };
      }
      return election;
    }));

    setVotedElections(new Set([...votedElections, electionId]));
    toast.success("Vote cast successfully!");
    setSelectedElection(null);
  };

  const handleCreateElection = (e) => {
    e.preventDefault();
    if (!user?.isAdmin) {
      toast.error("Only admins can create elections");
      return;
    }

    const election = {
      id: Date.now().toString(),
      ...newElection,
      status: 'upcoming',
      totalVotes: 0,
      eligibleVoters: 12547,
      candidates: []
    };

    setElections([...elections, election]);
    setNewElection({ title: '', description: '', startDate: '', endDate: '', candidates: [] });
    setShowNewElectionForm(false);
    toast.success("Election created successfully!");
  };

  const handleAddCandidate = (electionId) => {
    if (!newCandidate.name || !newCandidate.position) {
      toast.error("Please fill all candidate fields");
      return;
    }

    const candidate = {
      id: Date.now().toString(),
      ...newCandidate,
      votes: 0,
      platform: newCandidate.platform.split(',').map(p => p.trim()),
      profileImage: newCandidate.profileImage || 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=400'
    };

    setElections(elections.map(election => 
      election.id === electionId 
        ? { ...election, candidates: [...election.candidates, candidate] }
        : election
    ));

    setNewCandidate({ name: '', position: '', platform: '', profileImage: '' });
    toast.success("Candidate added successfully!");
  };

  const handleDeleteElection = (electionId) => {
    if (!user?.isAdmin) {
      toast.error("Only admins can delete elections");
      return;
    }
    
    setElections(elections.filter(election => election.id !== electionId));
    toast.success("Election deleted successfully!");
  };

  const handleRegisterVoter = (electionId, studentId) => {
    const currentVoters = registeredVoters[electionId] || [];
    if (currentVoters.includes(studentId)) {
      toast.error("Student is already registered for this election");
      return;
    }

    setRegisteredVoters({
      ...registeredVoters,
      [electionId]: [...currentVoters, studentId]
    });

    toast.success("Student registered successfully!");
  };

  const announceResults = (electionId) => {
    if (!user?.isAdmin) {
      toast.error("Only admins can announce results");
      return;
    }

    setElections(elections.map(election => 
      election.id === electionId 
        ? { ...election, status: 'completed' }
        : election
    ));
    toast.success("Election results announced!");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Student Elections
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-4xl mx-auto">
              Vote for your future student union leaders for Debre Berhan University
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Admin Controls */}
        {user?.isAdmin && (
          <div className="mb-8 bg-white rounded-xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Admin Controls</h2>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowVoterRegistration(true)}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Register Voters
                </button>
                <button
                  onClick={() => setShowNewElectionForm(!showNewElectionForm)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Election
                </button>
              </div>
            </div>

            {showNewElectionForm && (
              <form onSubmit={handleCreateElection} className="mt-6 space-y-4">
                <input
                  type="text"
                  placeholder="Election Title"
                  value={newElection.title}
                  onChange={(e) => setNewElection({...newElection, title: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
                <textarea
                  placeholder="Election Description"
                  value={newElection.description}
                  onChange={(e) => setNewElection({...newElection, description: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  required
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                    <input
                      type="date"
                      value={newElection.startDate}
                      onChange={(e) => setNewElection({...newElection, startDate: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                    <input
                      type="date"
                      value={newElection.endDate}
                      onChange={(e) => setNewElection({...newElection, endDate: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Create Election
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowNewElectionForm(false)}
                    className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Filter Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {["all", "active", "upcoming", "completed"].map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  selectedTab === tab
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>

        {/* Elections List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          {filteredElections.map((election, index) => (
            <motion.div
              key={election.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {election.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{election.description}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                      election.status
                    )}`}
                  >
                    {getStatusIcon(election.status)}
                    <span className="ml-1 capitalize">{election.status}</span>
                  </span>
                  {user?.isAdmin && (
                    <button
                      onClick={() => handleDeleteElection(election.id)}
                      className="text-red-600 hover:text-red-700 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-900">
                      Votes
                    </span>
                  </div>
                  <p className="text-lg font-bold text-gray-900 mt-1">
                    {election.totalVotes.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">
                    Registered: {(registeredVoters[election.id] || []).length}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-900">
                      Ends
                    </span>
                  </div>
                  <p className="text-lg font-bold text-gray-900 mt-1">
                    {new Date(election.endDate).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-gray-500">
                    {election.status === "active" ? "3 days left" : ""}
                  </p>
                </div>
              </div>

              {/* Candidates Preview */}
              {election.candidates.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">
                    Candidates ({election.candidates.length})
                  </h4>
                  <div className="flex -space-x-2">
                    {election.candidates.slice(0, 3).map((candidate) => (
                      <img
                        key={candidate.id}
                        src={candidate.profileImage}
                        alt={candidate.name}
                        className="w-8 h-8 rounded-full border-2 border-white object-cover"
                      />
                    ))}
                    {election.candidates.length > 3 && (
                      <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600">
                        +{election.candidates.length - 3}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Admin Candidate Management */}
              {user?.isAdmin && (
                <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                  <h5 className="text-sm font-medium text-gray-900 mb-2">Add Candidate</h5>
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="Name"
                      value={newCandidate.name}
                      onChange={(e) => setNewCandidate({...newCandidate, name: e.target.value})}
                      className="px-3 py-1 border border-gray-300 rounded text-sm"
                    />
                    <input
                      type="text"
                      placeholder="Position"
                      value={newCandidate.position}
                      onChange={(e) => setNewCandidate({...newCandidate, position: e.target.value})}
                      className="px-3 py-1 border border-gray-300 rounded text-sm"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Platform (comma separated)"
                    value={newCandidate.platform}
                    onChange={(e) => setNewCandidate({...newCandidate, platform: e.target.value})}
                    className="w-full px-3 py-1 border border-gray-300 rounded text-sm mb-2"
                  />
                  <input
                    type="url"
                    placeholder="Profile Image URL"
                    value={newCandidate.profileImage}
                    onChange={(e) => setNewCandidate({...newCandidate, profileImage: e.target.value})}
                    className="w-full px-3 py-1 border border-gray-300 rounded text-sm mb-2"
                  />
                  <button
                    onClick={() => handleAddCandidate(election.id)}
                    className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
                  >
                    Add Candidate
                  </button>
                </div>
              )}

              {/* Actions */}
              <div className="flex space-x-3">
                {election.status === "active" && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedElection(election)}
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    disabled={votedElections.has(election.id)}
                  >
                    <Vote className="w-4 h-4 inline mr-2" />
                    {votedElections.has(election.id) ? "Voted" : "Vote Now"}
                  </motion.button>
                )}
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  <Eye className="w-4 h-4 inline mr-2" />
                  View Details
                </motion.button>

                {election.status === "completed" && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 bg-green-100 text-green-700 py-2 px-4 rounded-lg font-medium hover:bg-green-200 transition-colors"
                  >
                    <BarChart3 className="w-4 h-4 inline mr-2" />
                    Results
                  </motion.button>
                )}

                {user?.isAdmin && election.status === "active" && (
                  <button
                    onClick={() => announceResults(election.id)}
                    className="bg-yellow-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-yellow-700 transition-colors"
                  >
                    Announce Results
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Voting Modal */}
        {selectedElection && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    {selectedElection.title}
                  </h2>
                  <button
                    onClick={() => setSelectedElection(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-4">
                  {selectedElection.candidates.map((candidate) => (
                    <div
                      key={candidate.id}
                      className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
                    >
                      <div className="flex items-start space-x-4">
                        <img
                          src={candidate.profileImage}
                          alt={candidate.name}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {candidate.name}
                          </h3>
                          <p className="text-gray-600">{candidate.position}</p>
                          <div className="mt-2">
                            <p className="text-sm font-medium text-gray-700 mb-1">
                              Platform:
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {candidate.platform.map((item, index) => (
                                <span
                                  key={index}
                                  className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                                >
                                  {item}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-gray-900">
                            {candidate.votes.toLocaleString()}
                          </p>
                          <p className="text-sm text-gray-500">votes</p>
                        </div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleVote(selectedElection.id, candidate.id)}
                        className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                        disabled={votedElections.has(selectedElection.id)}
                      >
                        {votedElections.has(selectedElection.id) 
                          ? "Already Voted" 
                          : `Vote for ${candidate.name}`
                        }
                      </motion.button>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Voter Registration Modal */}
        {showVoterRegistration && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    Register Voters for Elections
                  </h2>
                  <button
                    onClick={() => setShowVoterRegistration(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Elections List */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Election</h3>
                    <div className="space-y-3">
                      {elections.filter(e => e.status !== 'completed').map((election) => (
                        <div
                          key={election.id}
                          className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                            selectedElectionForVoters === election.id
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => setSelectedElectionForVoters(election.id)}
                        >
                          <h4 className="font-medium text-gray-900">{election.title}</h4>
                          <p className="text-sm text-gray-600">
                            Registered: {(registeredVoters[election.id] || []).length} voters
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Students List */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Students</h3>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          type="text"
                          placeholder="Search students..."
                          value={voterSearchTerm}
                          onChange={(e) => setVoterSearchTerm(e.target.value)}
                          className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {filteredStudents.map((student) => {
                        const isRegistered = selectedElectionForVoters && 
                          (registeredVoters[selectedElectionForVoters] || []).includes(student.id);
                        
                        return (
                          <div
                            key={student.id}
                            className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                          >
                            <div>
                              <h4 className="font-medium text-gray-900">{student.name}</h4>
                              <p className="text-sm text-gray-600">{student.email}</p>
                              <p className="text-xs text-gray-500">{student.studentId}</p>
                            </div>
                            <button
                              onClick={() => selectedElectionForVoters && handleRegisterVoter(selectedElectionForVoters, student.id)}
                              disabled={!selectedElectionForVoters || isRegistered}
                              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                                isRegistered
                                  ? 'bg-green-100 text-green-800 cursor-not-allowed'
                                  : selectedElectionForVoters
                                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                              }`}
                            >
                              {isRegistered ? 'Registered' : 'Register'}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}