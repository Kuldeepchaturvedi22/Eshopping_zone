// src/components/SearchBar.jsx
import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
const SearchBar = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    if (e.key === "Enter" && query.trim()) {
      navigate(`/products?search=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleButtonSearch = () => {
    if (query.trim()) {
      navigate(`/products?search=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <StyledWrapper>
      <div className="InputContainer">
        <input
          placeholder="Search products..."
          className="input"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleSearch}
        />
        <button 
          onClick={handleButtonSearch}
          className="search-button"
          type="button"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </button>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .InputContainer {
    width: 100%;
    max-width: 400px;
    height: 50px;
    display: flex;
    align-items: center;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 25px;
    overflow: hidden;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
  }

  .InputContainer:hover {
    background: rgba(255, 255, 255, 0.15);
    border-color: rgba(147, 51, 234, 0.5);
    box-shadow: 0 8px 32px rgba(147, 51, 234, 0.2);
  }

  .input {
    flex: 1;
    height: 40px;
    border: none;
    outline: none;
    caret-color: rgb(147, 51, 234);
    background-color: transparent;
    padding: 0 20px;
    letter-spacing: 0.5px;
    color: white;
    font-size: 14px;
    font-weight: 500;
  }

  .search-button {
    padding: 8px 12px;
    background: rgba(147, 51, 234, 0.2);
    border: none;
    color: rgba(255, 255, 255, 0.8);
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 4px;
    border-radius: 20px;
  }

  .search-button:hover {
    background: rgba(147, 51, 234, 0.4);
    color: white;
    transform: scale(1.05);
  }

  .input::placeholder {
    color: rgba(255, 255, 255, 0.7);
  }

  .input:focus {
    color: white;
  }

  @media (max-width: 768px) {
    .InputContainer {
      max-width: 300px;
      height: 45px;
    }
    
    .input {
      font-size: 13px;
      padding: 0 15px;
    }
    
    .search-button {
      padding: 6px 10px;
    }
    
    .search-button svg {
      width: 16px;
      height: 16px;
    }
  }
`;

export default SearchBar;
