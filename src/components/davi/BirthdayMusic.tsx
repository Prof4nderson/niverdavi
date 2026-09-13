import { Music2, Pause, Play } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import birthdaySong from "@/assets/audio/nove-anos-de-poder.mp3";

export function BirthdayMusic() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  const start = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio || !audio.paused) return;
    try {
      await audio.play();
      setPlaying(true);
    } catch {
      setPlaying(false);
    }
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.72;
    void start();

    const resumeAfterBrowserUnlock = () => void start();
    window.addEventListener("pointerdown", resumeAfterBrowserUnlock, { once: true });
    window.addEventListener("keydown", resumeAfterBrowserUnlock, { once: true });
    return () => {
      window.removeEventListener("pointerdown", resumeAfterBrowserUnlock);
      window.removeEventListener("keydown", resumeAfterBrowserUnlock);
      audio.pause();
    };
  }, [start]);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) void start();
    else audio.pause();
  };

  return (
    <>
      <audio
        ref={audioRef}
        src={birthdaySong}
        autoPlay
        loop
        playsInline
        preload="auto"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />
      <Button className="music-button" type="button" onClick={toggle} aria-label={playing ? "Pausar música" : "Tocar música de aniversário"}>
        {playing ? <Pause /> : <Play />}
        <Music2 />
        <span>{playing ? "Pausar música" : "Tocar música"}</span>
      </Button>
    </>
  );
}