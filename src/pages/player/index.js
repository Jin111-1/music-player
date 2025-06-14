import { useState, useEffect, useRef } from 'react';
import { Geist } from "next/font/google";
import { useSongs } from '../../hooks/useSongs';

const geist = Geist({
  subsets: ["latin"],
});

export default function Player() {
  const { songs, loading, error } = useSongs();
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);
  
  useEffect(() => {
    if (songs.length > 0 && !currentSong) {
      setCurrentSong(songs[0]);
    }
  }, [songs, currentSong]);

  useEffect(() => {
    if (currentSong) {
      audioRef.current.src = currentSong.url;
      if (isPlaying) {
        audioRef.current.play();
      }
    }
  }, [currentSong]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio.addEventListener('loadedmetadata', handleLoadedMetadata);
      audio.addEventListener('ended', handleEnded);
    }
    return () => {
      if (audio) {
        audio.removeEventListener('timeupdate', handleTimeUpdate);
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audio.removeEventListener('ended', handleEnded);
      }
    };
  }, []);

  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    setDuration(audioRef.current.duration);
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e) => {
    const seekTime = (e.nativeEvent.offsetX / e.target.offsetWidth) * duration;
    audioRef.current.currentTime = seekTime;
    setCurrentTime(seekTime);
  };

  const handleNext = () => {
    const currentIndex = songs.findIndex(song => song.id === currentSong.id);
    if (currentIndex < songs.length - 1) {
      setCurrentSong(songs[currentIndex + 1]);
    }
  };

  const handlePrevious = () => {
    const currentIndex = songs.findIndex(song => song.id === currentSong.id);
    if (currentIndex > 0) {
      setCurrentSong(songs[currentIndex - 1]);
    }
  };

  return (
    <div className={`${geist.className} min-h-screen bg-gradient-to-b from-gray-900 to-black text-white`}>
      <div className="container mx-auto px-4 py-8">
        <main className="max-w-4xl mx-auto">
          {loading ? (
            <div className="flex justify-center items-center min-h-[60vh]">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          ) : error ? (
            <div className="text-center text-red-500">
              <p>เกิดข้อผิดพลาด: {error}</p>
            </div>
          ) : (
            <>
              {currentSong && (
                <div className="bg-gray-800/50 rounded-lg p-6">
                  <div className="flex items-center gap-6 mb-8">
                    <div className="w-32 h-32 bg-gray-700 rounded-lg flex items-center justify-center overflow-hidden">
                      {currentSong.image ? (
                        <img 
                          src={currentSong.image} 
                          alt={currentSong.title} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-4xl">🎵</span>
                      )}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold mb-2">{currentSong.title}</h2>
                      <p className="text-gray-400">{currentSong.artist}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div 
                      className="w-full bg-gray-700 h-1 rounded-full cursor-pointer"
                      onClick={handleSeek}
                    >
                      <div 
                        className="bg-purple-500 h-1 rounded-full"
                        style={{ width: `${(currentTime / duration) * 100}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-sm text-gray-400">
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(duration)}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-6 mt-8">
                    <button 
                      onClick={handlePrevious}
                      className="p-3 hover:bg-gray-700 rounded-full transition-colors"
                    >
                      ⏮️
                    </button>
                    <button 
                      onClick={handlePlayPause}
                      className="p-4 bg-purple-600 hover:bg-purple-700 rounded-full transition-colors"
                    >
                      {isPlaying ? '⏸️' : '▶️'}
                    </button>
                    <button 
                      onClick={handleNext}
                      className="p-3 hover:bg-gray-700 rounded-full transition-colors"
                    >
                      ⏭️
                    </button>
                  </div>
                </div>
              )}

              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4">เพลงในคิว</h3>
                <div className="space-y-2">
                  {songs.map((song) => (
                    <div 
                      key={song.id} 
                      className={`flex items-center gap-4 p-3 hover:bg-gray-800/50 rounded-lg cursor-pointer ${
                        currentSong?.id === song.id ? 'bg-gray-800/50' : ''
                      }`}
                      onClick={() => setCurrentSong(song)}
                    >
                      <div className="w-12 h-12 bg-gray-700 rounded flex items-center justify-center overflow-hidden">
                        {song.image ? (
                          <img 
                            src={song.image} 
                            alt={song.title}    
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <span>🎵</span>
                        )}
                      </div>
                      <div>
                        <div>
                          <p>{song.title}</p>
                          <p>{song.artist}</p>
                        </div>
                        <div>
                          <p>{song.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </main>
      </div>
      <audio ref={audioRef} />
    </div>
  );
} 