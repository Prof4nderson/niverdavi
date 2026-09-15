import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  CalendarDays, Camera, Check, ChevronLeft, ChevronRight, Clock3,
  Gamepad2, Heart, MapPin, MessageCircleHeart, PartyPopper, Share2, Shirt, X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { BirthdayMusic } from "./BirthdayMusic";
import { DeveloperBadge } from "./DeveloperBadge"; // 1. Importando o badge criado
import { daviPhotos } from "../../lib/daviPhotos";

type Game = { title: string; subtitle: string; emoji: string; path: string; tone: string };
const games: Game[] = [
  { title: "Cyber Raid", subtitle: "Atire e proteja a missão", emoji: "⚡", path: "/games/cyber-raid.html", tone: "coral" },
  { title: "Igloo", subtitle: "Corra pela aventura gelada", emoji: "❄️", path: "/games/igloo.html", tone: "sky" },
  { title: "Keystone", subtitle: "Escape, pule e marque pontos", emoji: "🕹️", path: "/games/keystone.html", tone: "yellow" },
  { title: "Cyber Dragon", subtitle: "Voe pelo universo neon", emoji: "🐉", path: "/games/cyber-dragon.html", tone: "green" },
];

type Message = { name: string; text: string };

function partyDate() {
  const now = new Date();
  let year = now.getFullYear();
  let target = new Date(year, 8, 30, 19, 0, 0);
  if (target.getTime() < now.getTime()) target = new Date(++year, 8, 30, 19, 0, 0);
  return target;
}

function Countdown() {
  const target = useMemo(partyDate, []);
  const [remaining, setRemaining] = useState(() => Math.max(0, target.getTime() - Date.now()));
  useEffect(() => {
    const id = window.setInterval(() => setRemaining(Math.max(0, target.getTime() - Date.now())), 1000);
    return () => window.clearInterval(id);
  }, [target]);
  const values = [
    [Math.floor(remaining / 86400000), "dias"],
    [Math.floor((remaining / 3600000) % 24), "horas"],
    [Math.floor((remaining / 60000) % 60), "min"],
    [Math.floor((remaining / 1000) % 60), "seg"],
  ] as const;
  return <div className="countdown">{values.map(([value, label]) => <div key={label}><strong>{String(value).padStart(2, "0")}</strong><span>{label}</span></div>)}</div>;
}

function Confetti() {
  return <div className="confetti" aria-hidden>{Array.from({ length: 22 }, (_, index) => <i key={index} />)}</div>;
}

function PhotoCarousel({ onOpen }: { onOpen: (index: number) => void }) {
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);

  const select = (index: number) => {
    setDirection(index >= active ? 1 : -1);
    setActive((index + daviPhotos.length) % daviPhotos.length);
  };

  useEffect(() => {
    if (reduced) return;
    const timer = window.setInterval(() => {
      setDirection(1);
      setActive((current) => (current + 1) % daviPhotos.length);
    }, 4500);
    return () => window.clearInterval(timer);
  }, [reduced]);

  const current = daviPhotos[active];
  if (!current) return null;

  return (
    <div className="photo-carousel" role="region" aria-label="Carrossel de fotos do Davi">
      <div className="photo-carousel-stage">
        <AnimatePresence mode="wait" initial={false} custom={direction}>
          <motion.div
            key={current.src}
            className="photo-carousel-slide"
            custom={direction}
            initial={reduced ? false : { opacity: 0, x: direction * 28, scale: 1.025 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, x: direction * -28, scale: .985 }}
            transition={{ opacity: { duration: .65 }, x: { duration: .55 }, scale: { duration: .65 } }}
          >
            <Button type="button" variant="ghost" className="photo-carousel-image" onClick={() => onOpen(active)} aria-label={`Ampliar foto ${active + 1}`}>
              <img src={current.src} alt={current.alt} />
            </Button>
          </motion.div>
        </AnimatePresence>
        <Button type="button" size="icon" className="carousel-arrow carousel-arrow-left" onClick={() => select(active - 1)} aria-label="Foto anterior"><ChevronLeft /></Button>
        <Button type="button" size="icon" className="carousel-arrow carousel-arrow-right" onClick={() => select(active + 1)} aria-label="Próxima foto"><ChevronRight /></Button>
        <span className="photo-carousel-counter" aria-live="polite">{String(active + 1).padStart(2, "0")} / {String(daviPhotos.length).padStart(2, "0")}</span>
      </div>
      <div className="photo-carousel-thumbs" aria-label="Escolher foto">
        {daviPhotos.map((item, index) => (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            key={item.src}
            className={index === active ? "active" : undefined}
            onClick={() => select(index)}
            aria-label={`Mostrar foto ${index + 1}`}
            aria-current={index === active ? "true" : undefined}
          >
            <img src={item.src} alt="" loading={index < 5 ? "eager" : "lazy"} />
          </Button>
        ))}
      </div>
    </div>
  );
}

export default function BirthdayApp() {
  const reduced = useReducedMotion();
  const [photo, setPhoto] = useState<number | null>(null);
  const [game, setGame] = useState<Game | null>(null);
  const [rsvpOpen, setRsvpOpen] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [guestName, setGuestName] = useState("");
  const [people, setPeople] = useState("1");
  const [message, setMessage] = useState("");
  const [author, setAuthor] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    document.title = "Davi 9 anos — Você está convocado!";
    const saved = window.localStorage.getItem("davi-birthday-messages");
    if (saved) {
      try { setMessages(JSON.parse(saved) as Message[]); } catch { /* conteúdo local inválido */ }
    }
  }, []);

  const reveal = { initial: reduced ? false : { opacity: 0, y: 36 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: 0.15 }, transition: { duration: 0.65 } };

  const share = async (): Promise<void> => {
    const data = { title: "Davi 9 anos", text: "Você está convocado para o aniversário do Davi! Dia 30 de setembro, às 19h. Venha com sua blusa do Brasil! 🇧🇷", url: window.location.href };
    if (navigator.share) {
      await navigator.share(data).catch(() => undefined);
      return;
    }
    window.open(`https://wa.me/?text=${encodeURIComponent(`${data.text} ${data.url}`)}`, "_blank", "noopener");
  };

  const saveMessage = (event: React.FormEvent) => {
    event.preventDefault();
    if (!author.trim() || !message.trim()) {
      toast.error("Escreva seu nome e um recado.");
      return;
    }
    const next = [{ name: author.trim(), text: message.trim() }, ...messages].slice(0, 24);
    setMessages(next);
    window.localStorage.setItem("davi-birthday-messages", JSON.stringify(next));
    setAuthor(""); setMessage("");
    toast.success("Recado colocado no mural do Davi!");
  };

  return (
    <main className="davi-app">
      <Confetti />
      <header className="party-header">
        <a href="#topo" className="party-logo" aria-label="Início"><span>D</span><b>DAVI 9</b></a>
        <nav aria-label="Navegação principal"><a href="#convite">Convite</a><a href="#jogos">Jogos</a><a href="#fotos">Fotos</a></nav>
        <BirthdayMusic />
      </header>

      <section id="topo" className="party-hero">
        <div className="hero-pattern" aria-hidden />
        <motion.div className="hero-photo-wrap" initial={reduced ? false : { opacity: 0, scale: .84, rotate: -5 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ duration: .9, type: "spring" }}>
          <img src={daviPhotos[0].src} alt="Davi sorrindo, o aniversariante de 9 anos" className="hero-photo" />
          <span className="hero-photo-label"><Camera /> Davi em modo festa</span>
        </motion.div>
        <div className="hero-copy">
          <motion.p className="eyebrow" initial={reduced ? false : { opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>Você está convocado!</motion.p>
          <motion.h1 initial={reduced ? false : { opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .12 }}><span>Davi</span><strong>9 anos</strong></motion.h1>
          <motion.p className="hero-lead" initial={reduced ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .35 }}>Uma noite para celebrar, jogar e criar memórias gigantes.</motion.p>
          <div className="hero-actions">
            <Button type="button" className="party-cta" onClick={() => setRsvpOpen(true)}><Check /> Confirmar presença</Button>
            <Button type="button" className="party-share" variant="outline" onClick={share}><Share2 /> Compartilhar</Button>
          </div>
        </div>
        <motion.div className="shirt-burst" initial={reduced ? false : { scale: 0, rotate: -18 }} animate={{ scale: 1, rotate: -7 }} transition={{ delay: .5, type: "spring" }}><Shirt /><span>Venha com sua<br />blusa do Brasil!</span></motion.div>
        <a href="#convite" className="scroll-cue">Role para a festa <span>↓</span></a>
      </section>

      <motion.section id="convite" className="invite-band" {...reveal}>
        <div className="section-kicker">Marque na agenda</div>
        <div className="invite-grid">
          <div className="date-poster"><span>SET</span><strong>30</strong><small>Quarta-feira</small></div>
          <div className="invite-copy">
            <h2>A comemoração já tem hora e lugar.</h2>
            <div className="detail"><Clock3 /><div><small>Horário</small><strong>19 horas</strong></div></div>
            <div className="detail"><MapPin /><div><small>Local</small><strong>Petisco da Praça</strong><span>Praça São Sebastião, número 20</span></div></div>
            <Button className="party-cta" type="button" onClick={() => setRsvpOpen(true)}><PartyPopper /> Eu vou!</Button>
          </div>
        </div>
        <Countdown />
      </motion.section>

      <motion.section id="jogos" className="games-section" {...reveal}>
        <div className="section-heading"><div><p className="section-kicker">Arena do Davi</p><h2>Quatro jogos.<br />Uma missão.</h2></div><Gamepad2 /></div>
        <div className="games-grid">{games.map((item, index) => <motion.article key={item.path} className={`game-card ${item.tone}`} {...(!reduced ? { whileHover: { y: -8, rotate: index % 2 ? 1 : -1 } } : {})}><span className="game-number">0{index + 1}</span><span className="game-emoji">{item.emoji}</span><h3>{item.title}</h3><p>{item.subtitle}</p><Button type="button" onClick={() => setGame(item)}>Jogar agora <ChevronRight /></Button></motion.article>)}</div>
      </motion.section>

      <motion.section id="fotos" className="photos-section" {...reveal}>
        <p className="section-kicker">Álbum oficial</p><h2>O mundo pelos olhos do Davi.</h2>
        <PhotoCarousel onOpen={setPhoto} />
      </motion.section>

      <motion.section className="message-section" {...reveal}>
        <div className="message-intro"><MessageCircleHeart /><p className="section-kicker">Mural da torcida</p><h2>Deixe uma mensagem para o Davi.</h2><p>Seu carinho vira parte desta lembrança.</p></div>
        <form onSubmit={saveMessage} className="message-form"><label>Seu nome<input value={author} onChange={(event) => setAuthor(event.target.value)} maxLength={40} placeholder="Como você se chama?" /></label><label>Seu recado<textarea value={message} onChange={(event) => setMessage(event.target.value)} maxLength={220} placeholder="Escreva algo especial..." /></label><Button type="submit" className="party-cta"><Heart /> Enviar carinho</Button></form>
        {messages.length > 0 && <div className="message-wall">{messages.map((item, index) => <blockquote key={`${item.name}-${index}`}><p>“{item.text}”</p><cite>— {item.name}</cite></blockquote>)}</div>}
      </motion.section>

      {/* 2. Rodapé utilizando o componente DeveloperBadge criado */}
      <footer style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "2.5rem 1rem 1rem", gap: "1rem", width: "100%", background: "rgba(0, 0, 0, 0.8)", borderTop: "1px solid rgba(0, 255, 255, 0.2)", position: "relative", zIndex: 10 }}>
        <strong>DAVI 9</strong>
        <p style={{ margin: 0 }}>30 de setembro · 19h · Petisco da Praça</p>
        <Button type="button" onClick={share}><Share2 /> Espalhe a convocação</Button>
        
        <DeveloperBadge />
      </footer>

      <AnimatePresence>{rsvpOpen && <motion.div className="party-modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setRsvpOpen(false)}><motion.div className="party-modal" initial={{ y: 70, scale: .94 }} animate={{ y: 0, scale: 1 }} exit={{ y: 70, opacity: 0 }} onClick={(event) => event.stopPropagation()}><Button variant="ghost" size="icon" className="modal-close" onClick={() => setRsvpOpen(false)} aria-label="Fechar"><X /></Button>{confirmed ? <div className="confirmed"><span><Check /></span><p className="section-kicker">Presença confirmada</p><h2>Nos vemos na festa!</h2><p>{guestName}, sua torcida está convocada para 30 de setembro, às 19h.</p><Button onClick={share}><Share2 /> Compartilhar convite</Button></div> : <form onSubmit={(event) => { event.preventDefault(); if (!guestName.trim()) { toast.error("Digite seu nome."); return; } setConfirmed(true); window.localStorage.setItem("davi-rsvp", JSON.stringify({ name: guestName, people })); }}><p className="section-kicker">Confirmação</p><h2>Você vem torcer com o Davi?</h2><label>Seu nome<input value={guestName} onChange={(event) => setGuestName(event.target.value)} placeholder="Nome do convidado" required /></label><label>Quantas pessoas?<select value={people} onChange={(event) => setPeople(event.target.value)}>{[1,2,3,4,5,6].map(value => <option key={value} value={value}>{value} {value === 1 ? "pessoa" : "pessoas"}</option>)}</select></label><Button type="submit" className="party-cta"><Check /> Confirmar agora</Button></form>}</motion.div></motion.div>}
      {game && <motion.div className="game-modal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><div className="game-modal-top"><Button variant="ghost" onClick={() => setGame(null)}><X /> Fechar</Button><strong>{game.title}</strong><span>Vire o celular se precisar</span></div><iframe src={game.path} title={`Jogo ${game.title}`} allow="autoplay; fullscreen" /></motion.div>}
      {photo !== null && daviPhotos[photo] && <motion.div className="photo-modal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setPhoto(null)}><Button size="icon" onClick={() => setPhoto(null)} aria-label="Fechar foto"><X /></Button><Button size="icon" onClick={(event) => { event.stopPropagation(); setPhoto((photo - 1 + daviPhotos.length) % daviPhotos.length); }} aria-label="Foto anterior"><ChevronLeft /></Button><img src={daviPhotos[photo].src} alt={daviPhotos[photo].alt} onClick={(event) => event.stopPropagation()} /><Button size="icon" onClick={(event) => { event.stopPropagation(); setPhoto((photo + 1) % daviPhotos.length); }} aria-label="Próxima foto"><ChevronRight /></Button></motion.div>}
      </AnimatePresence>
    </main>
  );
}