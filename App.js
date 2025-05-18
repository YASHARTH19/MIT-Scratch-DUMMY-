import React, { useState } from 'react';

import SpriteArea from './components/SpriteArea';
import ControlPanel from './components/ControlPanel';
import CoordinateDisplay from './components/CoordinateDisplay';
import './App.css';
  import bulbasaurImg from './images/bulbasaur.png';
import totodileImg from './images/totodile.png';

<h1 style={{ textAlign: 'center', marginTop: '20px', fontSize: '2.5rem', color: '#333' }}>
  Scratch-like Visual Coding Editor
</h1>

const App = () => {

const initialSprites = [
  {
    id: 1,
    name: 'Bulbasaur',
    x: 100,
    y: 200,
    rotation: 0,
    blocks: [{ type: 'move', steps: 20 }],
    img: bulbasaurImg,
    message: 'Hi! I’m Bulbasaur.',
  },
  {
    id: 2,
    name: 'Totodile',
    x: 600,
    y: 200,
    rotation: 0,
    blocks: [{ type: 'move', steps: 20 }],
    img: totodileImg,
    message: 'Hello! I’m Totodile.',
  },
];


  const [sprites, setSprites] = useState(initialSprites);
  const [heroMode, setHeroMode] = useState(false);
  const [selectedSpriteId, setSelectedSpriteId] = useState(initialSprites[0].id);
  const [stepSize, setStepSize] = useState(20);  // Step size in pixels per move
  const [speed, setSpeed] = useState(30);        // Delay in milliseconds (lower is faster)

  const updateSpritePosition = (id, dx) => {
    setSprites(prev =>
      prev.map(sprite =>
        sprite.id === id ? { ...sprite, x: sprite.x + dx } : sprite
      )
    );
  };

  const onAddBlock = (spriteId, block) => {
    setSprites(prev =>
      prev.map(sprite =>
        sprite.id === spriteId
          ? { ...sprite, blocks: [...sprite.blocks, block] }
          : sprite
      )
    );
  };

  const onClearBlocks = (spriteId) => {
    setSprites(prev =>
      prev.map(sprite =>
        sprite.id === spriteId ? { ...sprite, blocks: [] } : sprite
      )
    );
  };

  const rotateSprite = (id) => {
    setSprites(prev =>
      prev.map(sprite =>
        sprite.id === id
          ? { ...sprite, rotation: (sprite.rotation + 90) % 360 }
          : sprite
      )
    );
  };

  const onStepSizeChange = (newStepSize) => {
    setStepSize(newStepSize);
  };

  const onSpeedChange = (newSpeed) => {
    setSpeed(newSpeed);
  };

  const onSelectSprite = (id) => {
    setSelectedSpriteId(id);
  };

  const playAll = async () => {
    const leftBound = 50;
    const rightBound = 700;

    let currentSprites = [...sprites];

    for (let i = 0; i < currentSprites.length; i++) {
      const sprite = currentSprites[i];

      for (const block of sprite.blocks) {
        if (block.type === 'move') {
          for (let step = 0; step < block.steps; step++) {
            currentSprites = currentSprites.map(s => {
              if (s.id === sprite.id) {
                const direction = s.id === 1 ? 1 : -1;
                const newX = s.x + direction * stepSize;

                if (newX >= leftBound && newX <= rightBound) {
                  return { ...s, x: newX };
                }
                return s;
              }
              return s;
            });

            setSprites(currentSprites);

            await new Promise(resolve => setTimeout(resolve, speed));

            if (heroMode) {
              const [s1, s2] = currentSprites;
              if (!s1 || !s2) continue;
              const dist = Math.abs(s1.x - s2.x);
              if (dist < 60) {
                currentSprites = currentSprites.map(s => {
                  if (s.id === s1.id) {
                    return { ...s, img: s2.img, message: s2.message };
                  }
                  if (s.id === s2.id) {
                    return { ...s, img: s1.img, message: s1.message };
                  }
                  return s;
                });
                setSprites(currentSprites);
              }
            }
          }
        }
      }
    }
  };

  const resetAll = () => {
    setSprites(initialSprites.map(sprite => ({ ...sprite, blocks: [{ type: 'move', steps: 20 }], rotation: 0 })));
    setHeroMode(false);
    setStepSize(20);
    setSpeed(30);
    setSelectedSpriteId(initialSprites[0].id);
  };

  const toggleHeroMode = () => {
    setHeroMode(prev => !prev);
  };

  return (
    <div className="app">
      <h1>Scratch Editor</h1>
      <div className="main">
        <div className="editor">
          <SpriteArea sprites={sprites} />
          <CoordinateDisplay sprites={sprites} />
          <ControlPanel
            playAll={playAll}
            resetAll={resetAll}
            toggleHeroMode={toggleHeroMode}
            heroMode={heroMode}
            rotateSprite={() => rotateSprite(selectedSpriteId)}
            selectedSpriteId={selectedSpriteId}
            onSelectSprite={onSelectSprite}
            sprites={sprites}
            stepSize={stepSize}
            onStepSizeChange={onStepSizeChange}
            speed={speed}
            onSpeedChange={onSpeedChange}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
