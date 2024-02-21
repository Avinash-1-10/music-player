import React, { useState, useEffect } from "react";

const App = () => {
  const [playlist, setPlaylist] = useState([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(-1);

  useEffect(() => {
    const storedPlaylist = JSON.parse(localStorage.getItem("playlist")) || [];
    const storedTrackIndex =
      parseInt(localStorage.getItem("currentTrackIndex"), 10) || -1;

    setPlaylist(storedPlaylist);
    setCurrentTrackIndex(storedTrackIndex);
  }, []);

  const handleFileUpload = (event) => {
    const files = event.target.files;
    const newPlaylist = Array.from(files).map((file) => ({
      name: file.name,
      url: URL.createObjectURL(file),
    }));

    setPlaylist((prevPlaylist) => [...prevPlaylist, ...newPlaylist]);
    localStorage.setItem(
      "playlist",
      JSON.stringify([...playlist, ...newPlaylist])
    );
  };

  const playTrack = (index) => {
    setCurrentTrackIndex(index);
    localStorage.setItem("currentTrackIndex", index.toString());
  };

  const handleTrackEnded = () => {
    const nextTrackIndex = (currentTrackIndex + 1) % playlist.length;
    setCurrentTrackIndex(nextTrackIndex);
    localStorage.setItem("currentTrackIndex", nextTrackIndex.toString());
  };

  const handleDeleteTrack = (index) => {
    const newPlaylist = [...playlist];
    newPlaylist.splice(index, 1);
    setPlaylist(newPlaylist);
    localStorage.setItem("playlist", JSON.stringify(newPlaylist));

    if (index === currentTrackIndex) {
      setCurrentTrackIndex(-1);
      localStorage.setItem("currentTrackIndex", "-1");
    } else if (index < currentTrackIndex) {
      setCurrentTrackIndex(currentTrackIndex - 1);
      localStorage.setItem(
        "currentTrackIndex",
        (currentTrackIndex - 1).toString()
      );
    }
  };

  const handlePlayPause = () => {
    const audio = document.getElementById("audioPlayer");
    if (audio.paused) {
      audio.play();
    } else {
      audio.pause();
    }
  };

  const handleNextTrack = () => {
    const nextTrackIndex = (currentTrackIndex + 1) % playlist.length;
    setCurrentTrackIndex(nextTrackIndex);
    localStorage.setItem("currentTrackIndex", nextTrackIndex.toString());
  };

  const handlePrevTrack = () => {
    const prevTrackIndex =
      (currentTrackIndex - 1 + playlist.length) % playlist.length;
    setCurrentTrackIndex(prevTrackIndex);
    localStorage.setItem("currentTrackIndex", prevTrackIndex.toString());
  };

  const handleShuffle = () => {
    const randomIndex = Math.floor(Math.random() * playlist.length);
    setCurrentTrackIndex(randomIndex);
    localStorage.setItem("currentTrackIndex", randomIndex.toString());
  };

  return (
    <div className="container">
      <label htmlFor="adfile" className="">upload</label>
      <input
        type="file"
        accept="audio/*"
        id="adfile"
        onChange={handleFileUpload}
        multiple
        style={{ display: "none" }}
      />
      <div className="playlist">
        {playlist.map((track, index) => (
          <div
            key={index}
            className={`track ${index === currentTrackIndex ? "active" : ""}`}
          >
            <span className="track-name" onClick={() => playTrack(index)}>
              {track.name}
            </span>
            <button onClick={() => playTrack(index)}>
              Play
            </button>
            <button className="delete" onClick={() => handleDeleteTrack(index)}>
              Delete
            </button>
          </div>
        ))}
      </div>
      {currentTrackIndex !== -1 && (
        <div className="player">
          <audio
            id="audioPlayer"
            controls
            autoPlay
            src={playlist[currentTrackIndex].url}
            onEnded={handleTrackEnded}
          />
          <div className="controls">
            <button onClick={handlePrevTrack}>Previous</button>
            <button onClick={handlePlayPause}>Play/Pause</button>
            <button onClick={handleNextTrack}>Next</button>
            <button onClick={handleShuffle}>Shuffle</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
