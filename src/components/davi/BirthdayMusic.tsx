import { Music2, Pause, Play } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import birthdaySongAsset from "@/assets/audio/nove-anos-de-poder.mp3.asset.json";
import dancingDog from "@/assets/dancing-dog.png";

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

    const resumeAfterBrowserUnlock = (event: Event) => {
      const target = event.target;
      if (target instanceof Element && target.closest(".music-button")) return;
      void start();
    };
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
    <div className={`music-companion ${playing ? "is-playing" : "is-paused"}`}>
      <audio
        ref={audioRef}
        src={birthdaySongAsset.url}
        autoPlay
        loop
        playsInline
        preload="auto"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />
      <div className="dog-guide" aria-hidden="true">
        {!playing && <span className="sound-bubble">Ligue o som aqui</span>}
        <img className="dancing-dog" src={dancingDog} alt="" />
      </div>
      <Button
        className="music-button"
        type="button"
        onClick={toggle}
        aria-label={playing ? "Pausar música" : "Tocar música de aniversário"}
        aria-pressed={playing}
      >
        {playing ? <Pause /> : <Play />}
        <Music2 />
        <span>{playing ? "Pausar música" : "Tocar música"}</span>
      </Button>
    </div>
  );
}