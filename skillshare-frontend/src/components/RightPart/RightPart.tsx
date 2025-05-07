import React, { useState, useEffect, useRef } from "react";
import SearchIcon from "@mui/icons-material/Search";
import Brightness6Icon from "@mui/icons-material/Brightness6";
import { Button, Avatar, CircularProgress, Box, Typography, Divider } from "@mui/material";
import SubscriptionModal from "../SubscriptionModal/SubscriptionModal";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getAuthToken, isAuthenticated } from '../Authentication/auth';

const RightPart = () => {
  const [openSubscriptionModal, setOpenSubscriptionModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const searchContainerRef = useRef(null);
  const navigate = useNavigate();

  const handleOpenSubscriptionModal = () => setOpenSubscriptionModal(true);
  const handleCloseSubscriptionModal = () => setOpenSubscriptionModal(false);

  const handleChangeTheme = () => {
    console.log("handle change theme");
    // Theme implementation would go here
  };

  const fetchUsers = async (query = "") => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }
    
    setLoading(true);
    try {
      const token = getAuthToken();
      if (!token) {
        console.error("No authentication token found");
        navigate('/login');
        return;
      }

      const response = await axios.get(`http://localhost:8080/api/users/search`, {
        params: { query },
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setSearchResults(response.data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
      
      if (error.response?.status === 401) {
        navigate('/login');
      }
      
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.trim() !== "" || showResults) {
      fetchUsers(query);
    }
  };

  const handleSearchFocus = () => {
    setShowResults(true);
    if (searchQuery.trim() === "") {
      fetchUsers();
    }
  };

  const handleUserClick = (userId) => {
    navigate(`/profile/${userId}`);
    setShowResults(false);
  };

  return (
    <Box sx={{ py: 5, position: "sticky", top: 20, maxWidth: 360, mx: "auto" }}>
      {/* Search Input and Results */}
      <Box ref={searchContainerRef} sx={{ position: "relative", mb: 4 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            backgroundColor: "background.paper",
            borderRadius: 50,
            boxShadow: 2,
            px: 2,
            py: 0.5,
            gap: 1,
            border: "1px solid",
            borderColor: "divider",
            "&:focus-within": {
              boxShadow: (theme) => `0 0 0 3px ${theme.palette.primary.light}`,
              borderColor: "primary.main",
            },
          }}
        >
          <SearchIcon color="action" />
          <input
            type="text"
            className="search-input"
            placeholder="Search users..."
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={handleSearchFocus}
            style={{
              border: "none",
              outline: "none",
              flexGrow: 1,
              fontSize: 16,
              backgroundColor: "transparent",
              padding: "8px 0",
              color: "#333",
              fontFamily: "inherit",
            }}
          />
          <Brightness6Icon
            onClick={handleChangeTheme}
            sx={{
              cursor: "pointer",
              color: "text.secondary",
              "&:hover": { color: "primary.main" },
              transition: "color 0.3s",
            }}
          />
        </Box>

        {/* Search Results Dropdown */}
        {showResults && (
          <Box
            sx={{
              position: "absolute",
              top: "calc(100% + 8px)",
              left: 0,
              right: 0,
              bgcolor: "background.paper",
              borderRadius: 2,
              boxShadow: 4,
              maxHeight: 280,
              overflowY: "auto",
              zIndex: 9999,
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
                <CircularProgress size={28} />
              </Box>
            ) : searchResults.length > 0 ? (
              searchResults.map((user) => (
                <Box
                  key={user.id}
                  onClick={() => handleUserClick(user.id)}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    px: 3,
                    py: 1.5,
                    cursor: "pointer",
                    transition: "background-color 0.2s",
                    "&:hover": { bgcolor: "action.hover" },
                  }}
                >
                  <Avatar
                    src={user.image || "/default-avatar.png"}
                    alt={user.fullName}
                    sx={{ width: 40, height: 40 }}
                  />
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="subtitle1" noWrap>
                      {user.fullName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      @{user.userId || user.email?.split('@')[0]}
                    </Typography>
                  </Box>
                  {user.isVerified && (
                    <Typography
                      variant="caption"
                      sx={{ color: "primary.main", fontWeight: "bold" }}
                      title="Verified"
                    >
                      ✓
                    </Typography>
                  )}
                </Box>
              ))
            ) : (
              <Box sx={{ p: 3, textAlign: "center", color: "text.secondary" }}>
                {searchQuery.trim() !== "" ? "No users found" : "Start typing to search users"}
              </Box>
            )}
          </Box>
        )}
      </Box>

      {/* Subscription Section */}
      <Box
        sx={{
          p: 3,
          bgcolor: "primary.light",
          borderRadius: 3,
          boxShadow: 3,
          textAlign: "center",
          mb: 6,
          userSelect: "none",
        }}
      >
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Get Verified
        </Typography>
        <Typography variant="body1" mb={2} color="text.secondary">
          Subscribe to unlock new features
        </Typography>
        <Button
          variant="contained"
          size="large"
          sx={{ borderRadius: 25, px: 5, py: 1.5, fontWeight: "bold" }}
          onClick={handleOpenSubscriptionModal}
          disableElevation
        >
          Get Verified
        </Button>
      </Box>

      {/* What's Happening Section */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          What's Happening?
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Typography variant="body2" color="text.secondary" sx={{ fontStyle: "italic" }}>
          No recent updates.
        </Typography>
      </Box>

      {/* Subscription Modal */}
      <SubscriptionModal open={openSubscriptionModal} handleClose={handleCloseSubscriptionModal} />
    </Box>
  );
};

export default RightPart;
