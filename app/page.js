'use client';

import { useState, useEffect, useRef } from 'react';

export default function HorrorStory() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentScene, setCurrentScene] = useState(0);
  const canvasRef = useRef(null);
  const audioContextRef = useRef(null);

  const story = [
    {
      text: "The old house stood abandoned...",
      duration: 4000,
      color: '#1a1a1a',
      textColor: '#8b0000'
    },
    {
      text: "Nobody had lived there for decades...",
      duration: 4000,
      color: '#0d0d0d',
      textColor: '#a00000'
    },
    {
      text: "But tonight, something stirred within...",
      duration: 4000,
      color: '#050505',
      textColor: '#c00000'
    },
    {
      text: "A shadow moved across the window...",
      duration: 4000,
      color: '#000000',
      textColor: '#ff0000'
    },
    {
      text: "Scratching sounds echoed from the basement...",
      duration: 4000,
      color: '#0a0000',
      textColor: '#ff1a1a'
    },
    {
      text: "The door slowly creaked open...",
      duration: 4000,
      color: '#1a0000',
      textColor: '#ff3333'
    },
    {
      text: "And then... nothing but silence...",
      duration: 4000,
      color: '#000000',
      textColor: '#8b0000'
    },
    {
      text: "THE END",
      duration: 3000,
      color: '#000000',
      textColor: '#ff0000'
    }
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = 1920;
    canvas.height = 1080;

    let animationFrame;
    let flickerInterval;

    const drawScene = () => {
      const scene = story[currentScene];
      if (!scene) return;

      ctx.fillStyle = scene.color;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Add noise effect
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imageData.data;
      for (let i = 0; i < pixels.length; i += 4) {
        const noise = Math.random() * 20 - 10;
        pixels[i] += noise;
        pixels[i + 1] += noise;
        pixels[i + 2] += noise;
      }
      ctx.putImageData(imageData, 0, 0);

      // Draw text with glitch effect
      ctx.font = 'bold 72px serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const glitchOffset = Math.random() * 4 - 2;

      ctx.fillStyle = scene.textColor;
      ctx.shadowColor = scene.textColor;
      ctx.shadowBlur = 20;

      const lines = scene.text.split('\n');
      lines.forEach((line, index) => {
        const yPos = canvas.height / 2 + (index - (lines.length - 1) / 2) * 100;
        ctx.fillText(line, canvas.width / 2 + glitchOffset, yPos);
      });

      // Add vignette effect
      const gradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, canvas.width / 4,
        canvas.width / 2, canvas.height / 2, canvas.width / 1.5
      );
      gradient.addColorStop(0, 'rgba(0,0,0,0)');
      gradient.addColorStop(1, 'rgba(0,0,0,0.8)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    if (isPlaying) {
      const animate = () => {
        drawScene();
        animationFrame = requestAnimationFrame(animate);
      };
      animate();

      flickerInterval = setInterval(() => {
        if (Math.random() > 0.8) {
          canvas.style.opacity = Math.random() * 0.5 + 0.5;
          setTimeout(() => {
            canvas.style.opacity = 1;
          }, 50);
        }
      }, 200);
    }

    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
      if (flickerInterval) clearInterval(flickerInterval);
    };
  }, [currentScene, isPlaying]);

  useEffect(() => {
    if (!isPlaying) return;

    const timer = setTimeout(() => {
      if (currentScene < story.length - 1) {
        setCurrentScene(currentScene + 1);
      } else {
        setIsPlaying(false);
        setCurrentScene(0);
      }
    }, story[currentScene].duration);

    return () => clearTimeout(timer);
  }, [currentScene, isPlaying]);

  const playHorrorSound = () => {
    if (typeof window === 'undefined') return;

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioContextRef.current = new AudioContext();
    const ctx = audioContextRef.current;

    const createScarySound = (time) => {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.type = 'sawtooth';
      oscillator.frequency.setValueAtTime(40 + Math.random() * 60, ctx.currentTime + time);

      gainNode.gain.setValueAtTime(0, ctx.currentTime + time);
      gainNode.gain.linearRampToValueAtTime(0.1, ctx.currentTime + time + 0.1);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + time + 2);

      oscillator.start(ctx.currentTime + time);
      oscillator.stop(ctx.currentTime + time + 2);
    };

    for (let i = 0; i < story.length; i++) {
      const time = i * 4;
      createScarySound(time);

      if (Math.random() > 0.5) {
        createScarySound(time + 1);
      }
    }
  };

  const handlePlay = () => {
    setIsPlaying(true);
    setCurrentScene(0);
    playHorrorSound();
  };

  const handleStop = () => {
    setIsPlaying(false);
    setCurrentScene(0);
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#000',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <style jsx global>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          background: #000;
          color: #fff;
          font-family: 'Courier New', monospace;
        }
      `}</style>

      <h1 style={{
        color: '#8b0000',
        fontSize: '48px',
        marginBottom: '40px',
        textShadow: '0 0 20px #ff0000',
        fontFamily: 'serif'
      }}>
        THE ABANDONED HOUSE
      </h1>

      <div style={{
        position: 'relative',
        maxWidth: '1280px',
        width: '100%',
        aspectRatio: '16/9',
        backgroundColor: '#000',
        border: '2px solid #8b0000',
        boxShadow: '0 0 30px rgba(139, 0, 0, 0.5)',
        marginBottom: '30px'
      }}>
        <canvas
          ref={canvasRef}
          style={{
            width: '100%',
            height: '100%',
            display: 'block',
            transition: 'opacity 0.05s'
          }}
        />
      </div>

      <div style={{
        display: 'flex',
        gap: '20px'
      }}>
        <button
          onClick={handlePlay}
          disabled={isPlaying}
          style={{
            padding: '15px 40px',
            fontSize: '20px',
            backgroundColor: isPlaying ? '#333' : '#8b0000',
            color: '#fff',
            border: '2px solid #ff0000',
            borderRadius: '5px',
            cursor: isPlaying ? 'not-allowed' : 'pointer',
            fontFamily: 'serif',
            textShadow: '0 0 10px #ff0000',
            boxShadow: isPlaying ? 'none' : '0 0 20px rgba(255, 0, 0, 0.5)',
            transition: 'all 0.3s'
          }}
          onMouseEnter={(e) => {
            if (!isPlaying) {
              e.target.style.backgroundColor = '#a00000';
              e.target.style.transform = 'scale(1.05)';
            }
          }}
          onMouseLeave={(e) => {
            if (!isPlaying) {
              e.target.style.backgroundColor = '#8b0000';
              e.target.style.transform = 'scale(1)';
            }
          }}
        >
          {isPlaying ? 'PLAYING...' : 'PLAY STORY'}
        </button>

        <button
          onClick={handleStop}
          disabled={!isPlaying}
          style={{
            padding: '15px 40px',
            fontSize: '20px',
            backgroundColor: !isPlaying ? '#333' : '#4a0000',
            color: '#fff',
            border: '2px solid #8b0000',
            borderRadius: '5px',
            cursor: !isPlaying ? 'not-allowed' : 'pointer',
            fontFamily: 'serif',
            transition: 'all 0.3s'
          }}
          onMouseEnter={(e) => {
            if (isPlaying) {
              e.target.style.backgroundColor = '#600000';
              e.target.style.transform = 'scale(1.05)';
            }
          }}
          onMouseLeave={(e) => {
            if (isPlaying) {
              e.target.style.backgroundColor = '#4a0000';
              e.target.style.transform = 'scale(1)';
            }
          }}
        >
          STOP
        </button>
      </div>

      <div style={{
        marginTop: '40px',
        textAlign: 'center',
        color: '#666',
        fontSize: '14px'
      }}>
        {isPlaying && (
          <p>Scene {currentScene + 1} of {story.length}</p>
        )}
      </div>
    </div>
  );
}
