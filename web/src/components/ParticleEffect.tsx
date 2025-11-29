import React, { useEffect, useState } from 'react';
import './ParticleEffect.css';

interface Particle {
  id: number;
  x: number;
  y: number;
  type: 'damage' | 'heal' | 'block' | 'xp';
  text: string;
}

export function useParticleEffect() {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [nextId, setNextId] = useState(0);

  const addParticle = (x: number, y: number, type: 'damage' | 'heal' | 'block' | 'xp', text: string) => {
    const id = nextId;
    setNextId(id + 1);

    const particle: Particle = { id, x, y, type, text };
    setParticles((prev) => [...prev, particle]);

    // Remove particle after animation completes
    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => p.id !== id));
    }, 1500);
  };

  return { particles, addParticle };
}

interface ParticleEffectsProps {
  particles: Particle[];
}

export function ParticleEffects({ particles }: ParticleEffectsProps) {
  return (
    <div className="particle-container">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className={`particle particle-${particle.type}`}
          style={{
            left: particle.x,
            top: particle.y,
          }}
        >
          {particle.text}
        </div>
      ))}
    </div>
  );
}
