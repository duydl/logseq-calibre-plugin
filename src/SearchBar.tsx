import React, { useEffect, useRef, useState } from 'react';
import * as SearchFuncs from './search';
import { clearDriftless, setDriftlessTimeout } from "driftless";
import './SearchBar.css'

const SearchBar: React.FC = () => {
  const searchDivRef = useRef<HTMLDivElement>(null);
  const searchBarRef = useRef<HTMLInputElement>(null);
  const searchResultsRef = useRef<HTMLUListElement>(null);
  const [typingTimer, setTypingTimer] = useState<number | undefined>(undefined);
  const exitSearch = () => {
    SearchFuncs.exitSearch();
  };

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        exitSearch();
      }
    };

    const searchDiv = searchDivRef.current;
    searchDiv?.addEventListener('keydown', handleKeydown);

    return () => {
      searchDiv?.removeEventListener('keydown', handleKeydown);
    };
  }, []);

  useEffect(() => {
    searchBarRef.current?.focus();
  }, []);

  const handleInput = () => {
    if (searchResultsRef.current) {
      SearchFuncs.clearSearchResults();
      clearDriftless(typingTimer);
      setTypingTimer(
        setDriftlessTimeout(() => {
          if (searchBarRef.current?.value) {
            SearchFuncs.getCalibreItems(searchBarRef.current.value);
          }
        }, 750) as unknown as number
      );
    }
  };

  return (
    <div id="search" ref={searchDivRef}>
      <div id="search-bar-container">
        <div className="icon-container">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="icon icon-tabler icon-tabler-letter-c"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="#CC7000"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M17 4H12 C11 4 7 6 7 12 C7 18 11 20 12 20 H17" />
          </svg>
        </div>
        <input
          id="search-bar"
          type="text"
          placeholder="Search Calibre library"
          ref={searchBarRef}
          onInput={handleInput}
        />
        <div className="icon-container">
          <button id="close-button" onClick={exitSearch} aria-label="Close">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="icon icon-tabler icon-tabler-x"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="#CC7000"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
      <ul id="search-results" ref={searchResultsRef}></ul>
    </div>
  );
};

export default SearchBar;