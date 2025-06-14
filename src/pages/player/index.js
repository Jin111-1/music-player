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
      const handleTimeUpdate = () => {
        setCurrentTime(audio.currentTime);
      };

      const handleLoadedMetadata = () => {
        setDuration(audio.duration);
      };

      const handleEnded = () => {
        const currentIndex = songs.findIndex(song => song.id === currentSong.id);
        if (currentIndex < songs.length - 1) {
          setCurrentSong(songs[currentIndex + 1]);
          setIsPlaying(true);
        } else {
          setCurrentSong(songs[0]);
          setIsPlaying(true);
        }
      };

      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio.addEventListener('loadedmetadata', handleLoadedMetadata);
      audio.addEventListener('ended', handleEnded);

      return () => {
        audio.removeEventListener('timeupdate', handleTimeUpdate);
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audio.removeEventListener('ended', handleEnded);
      };
    }
  }, [currentSong, songs]);

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

//เลือกเวลา
  const handleSeek = (e) => {
    if (!audioRef.current || !duration) return;
    
    const progressBar = e.target;
    const clickPosition = e.nativeEvent.offsetX;
    const widthPercentage = (clickPosition / progressBar.offsetWidth) * 100;
    const seekTime = (widthPercentage / 100) * duration;
    
    if (seekTime >= 0 && seekTime <= duration) {
      audioRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
  };

  const handleNext = () => {
    const currentIndex = songs.findIndex(song => song.id === currentSong.id);
    if (currentIndex < songs.length - 1) {
      setCurrentSong(songs[currentIndex + 1]);
      setIsPlaying(true);
    } else {
      setCurrentSong(songs[0]);
      setIsPlaying(true);
    }
  };

  const handlePrevious = () => {
    const currentIndex = songs.findIndex(song => song.id === currentSong.id);
    if (currentIndex > 0) {
      setCurrentSong(songs[currentIndex - 1]);
      setIsPlaying(true);
    } else {
      setCurrentSong(songs[songs.length - 1]);
      setIsPlaying(true);
    }
  };
 

  return (
    <div className={`${geist.className} min-h-screen bg-black text-white`}>
      <div className="container mx-auto px-4 py-8">
        <main className="max-w-4xl mx-auto">
          {loading ? (
            <div className="flex justify-center items-center min-h-[60vh]">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
          ) : error ? (
            <div className="text-center text-red-500">
              <p>เกิดข้อผิดพลาด: {error}</p>
            </div>
          ) : (
            <>
              {currentSong && (
                <div className="fixed bottom-0 left-0 right-0 w-full bg-[#181818] p-4 border-t border-gray-800">
                  <div className="flex items-center justify-between max-w-7xl mx-auto">
                    <div className="flex items-center gap-4">
                      <div className="w-[56px] h-[56px] bg-gray-800 rounded flex items-center justify-center overflow-hidden">
                        {currentSong.image ? (
                          <img 
                            src={currentSong.image} 
                            alt={currentSong.title} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-2xl">🎵</span>
                        )}
                      </div>
                      <div>
                        <h2 className="text-sm font-medium hover:underline cursor-pointer">{currentSong.title}</h2>
                        <p className="text-xs text-gray-400 hover:underline cursor-pointer">{currentSong.artist}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-center gap-2">
                      <div className="flex items-center justify-center gap-6">
                        <button 
                          onClick={handlePrevious}
                          className="p-2 hover:scale-110 transition-transform text-gray-400 hover:text-white"
                        >
                          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
                          </svg>
                        </button>
                        <button 
                          onClick={handlePlayPause}
                          className="p-3 bg-white hover:scale-110 rounded-full transition-transform"
                        >
                          {isPlaying ? (
                            <svg className="w-5 h-5 text-black" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M6 4h4v16H6zm8 0h4v16h-4z"/>
                            </svg>
                          ) : (
                            <svg className="w-5 h-5 text-black" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M8 5v14l11-7z"/>
                            </svg>
                          )}
                        </button>
                        <button 
                          onClick={handleNext}
                          className="p-2 hover:scale-110 transition-transform text-gray-400 hover:text-white"
                        >
                          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
                          </svg>
                        </button>
                      </div>
                      <div className="flex items-center gap-2 w-[400px]">
                        <span className="text-xs text-gray-400">{formatTime(currentTime)}</span>
                        <div 
                          className="flex-1 h-1 bg-gray-600 rounded-full cursor-pointer group"
                          onClick={handleSeek}
                        >
                          <div 
                            className="h-full bg-white rounded-full group-hover:bg-green-500 transition-colors"
                            style={{ width: `${(currentTime / duration) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-400">{formatTime(duration)}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <button className="text-gray-400 hover:text-white">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                        </svg>
                      </button>
                      <button className="text-gray-400 hover:text-white">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z"/>
                          <path d="M12 17.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-8 mb-24">
                <div className="flex items-center mb-6">
                  <button className="w-12 h-12 flex items-center justify-center rounded-full bg-[#1ed760] shadow-lg hover:scale-105 transition-transform">
                    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="14" cy="14" r="14" fill="#1ed760"/>
                      <polygon points="11,9 20,14 11,19" fill="black"/>
                    </svg>
                  </button>
                </div>
                <div className="grid grid-cols-12 px-4 py-2 text-gray-400 text-xs font-semibold border-b border-gray-700 mb-2">
                  <div className="col-span-1">#</div>
                  <div className="col-span-5">Title</div>
                  <div className="col-span-4">Album</div>
                  <div className="col-span-2 text-right pr-2">
                    <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
                      <circle cx="8" cy="8" r="6.5" stroke="currentColor"/>
                      <path stroke="currentColor" stroke-linecap="round" stroke-width="1.2" d="M8 4.5v4l2.5 2"/>
                    </svg>
                  </div>
                </div>
                <div className="space-y-2">
                  {songs.map((song) => (
                    <div 
                      key={song.id} 
                      className={`flex items-center gap-4 p-3 hover:bg-gray-800/50 rounded-lg cursor-pointer group ${
                        currentSong?.id === song.id ? 'bg-gray-800/50' : ''
                      }`}
                      onClick={() => setCurrentSong(song)}
                    >
                     
                      <div className="w-12 h-12 bg-gray-800 rounded flex items-center justify-center overflow-hidden">
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
                      <div className="flex-1">
                        <ol>
                          <li className="font-medium group-hover:text-green-500 transition-colors">{song.title}</li>
                          <li className="text-sm text-gray-400">{song.artist}</li>
                        </ol>
                      </div>
                      <div className="text-sm text-gray-400">
                        {song.time}
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