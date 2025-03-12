'use client';

import { useMemo } from 'react';

interface GrowingPlantProps {
  points: number;
  className?: string;
}

export function GrowingPlant({ points, className = '' }: GrowingPlantProps) {
  // Calculate growth percentage (max at 100 points)
  const growthPercent = useMemo(
    () => Math.min((points / 100) * 100, 100),
    [points]
  );

  // Calculate plant color based on points
  const plantColor = useMemo(() => {
    if (points >= 100) return '#2d6a4f'; // Full bloom - rich forest green
    if (points >= 75) return '#40916c'; // Almost there - mature green
    if (points >= 50) return '#52b788'; // Halfway - vibrant green
    if (points >= 25) return '#74c69d'; // Starting - young green
    return '#95d5b2'; // Seed/sprout - light green
  }, [points]);

  const leafColor = useMemo(() => {
    // Slightly lighter variant of plantColor for leaves
    if (points >= 100) return '#40916c';
    if (points >= 75) return '#52b788';
    if (points >= 50) return '#74c69d';
    if (points >= 25) return '#95d5b2';
    return '#b7e4c7';
  }, [points]);

  return (
    <div className={`relative flex flex-col items-center gap-2 ${className}`}>
      {/* Points display */}
      <div className='rounded-full bg-[#00e5bf] px-3 py-1 text-xs font-semibold text-black'>
        {points}/100 Daily Points
      </div>

      {/* Plant SVG */}
      <svg
        viewBox='0 0 100 100'
        className='h-full w-full'
        style={{
          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))',
        }}
      >
        {/* Rich soil with texture */}
        <path
          d='M10,85 Q30,82 50,85 Q70,88 90,85 L90,95 L10,95 Z'
          fill='#40241a'
          opacity='0.9'
        />
        <path
          d='M15,85 Q35,83 50,85 Q65,87 85,85'
          fill='none'
          stroke='#5d4037'
          strokeWidth='1'
          opacity='0.7'
        />

        {/* Plant growth container with faster animation */}
        <g
          transform={`scale(${0.3 + (growthPercent * 0.7) / 100}, ${0.3 + (growthPercent * 0.7) / 100})`}
          style={{
            transformOrigin: '50px 85px',
            transition: 'transform 0.3s ease-out',
          }}
        >
          {/* Main stem structure - more natural curve */}
          <path
            d={`M50,85 C50,${85 - growthPercent * 0.6} 
                ${48 + Math.sin(growthPercent * 0.05) * 8},${60 - growthPercent * 0.4} 
                ${48 + Math.sin(growthPercent * 0.03) * 4},${30}`}
            fill='none'
            stroke={plantColor}
            strokeWidth='3'
            strokeLinecap='round'
            style={{ transition: 'all 0.3s ease-out' }}
          />

          {points >= 25 && (
            <>
              {/* First set of leaves - more natural */}
              <path
                d={`M50,75 
                   Q35,70 30,80 
                   Q40,70 50,75
                   M50,75
                   Q65,70 70,80
                   Q60,70 50,75`}
                fill={leafColor}
                stroke={plantColor}
                strokeWidth='1'
                opacity='0.9'
                style={{ transition: 'all 0.3s ease-out' }}
              />
            </>
          )}

          {points >= 50 && (
            <>
              {/* Second set of leaves - more dynamic */}
              <path
                d={`M48,60 
                   Q30,55 25,70 
                   Q35,55 48,60
                   M52,60
                   Q70,55 75,70
                   Q65,55 52,60`}
                fill={leafColor}
                stroke={plantColor}
                strokeWidth='1'
                opacity='0.9'
                style={{ transition: 'all 0.3s ease-out' }}
              />
            </>
          )}

          {points >= 75 && (
            <>
              {/* Third set of leaves - elegant curves */}
              <path
                d={`M48,45 
                   Q25,40 20,60 
                   Q30,42 48,45
                   M52,45
                   Q75,40 80,60
                   Q70,42 52,45`}
                fill={leafColor}
                stroke={plantColor}
                strokeWidth='1'
                opacity='0.9'
                style={{ transition: 'all 0.3s ease-out' }}
              />
            </>
          )}

          {points >= 100 && (
            <>
              {/* Sunflower */}
              <g transform='translate(45,25)'>
                {/* Petals */}
                {Array.from({ length: 12 }).map((_, i) => (
                  <path
                    key={i}
                    d={`M0,0 Q4,-3 0,-12 Q-4,-3 0,0`}
                    fill='#FFA500'
                    stroke='#FF8C00'
                    strokeWidth='0.5'
                    transform={`rotate(${i * 30})`}
                    style={{ transition: 'all 0.3s ease-out' }}
                  />
                ))}

                {/* Center of the flower */}
                <circle
                  r='6'
                  fill='#FFD700'
                  stroke='#DAA520'
                  strokeWidth='0.5'
                />

                {/* Center texture */}
                <circle r='4.5' fill='#B8860B' fillOpacity='0.3' />
              </g>

              {/* Additional leaves near flower */}
              <path
                d={`M40,30 
                   Q30,28 25,35 
                   Q33,30 40,30
                   M50,30
                   Q60,28 65,35
                   Q57,30 50,30`}
                fill={leafColor}
                stroke={plantColor}
                strokeWidth='1'
                opacity='0.9'
                style={{ transition: 'all 0.3s ease-out' }}
              />
            </>
          )}
        </g>
      </svg>
    </div>
  );
}
