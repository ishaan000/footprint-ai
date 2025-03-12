'use client';

import { useMemo } from 'react';

interface GrowingPlantProps {
  points: number;
  className?: string;
}

export function GrowingPlant({ points, className = '' }: GrowingPlantProps) {
  // Calculate growth percentage (max at 1000 points)
  const growthPercent = useMemo(
    () => Math.min((points / 1000) * 100, 100),
    [points]
  );

  // Calculate plant color based on points
  const plantColor = useMemo(() => {
    if (points >= 1000) return '#1b4d1b'; // Full tree - deep forest green
    if (points >= 500) return '#2d5a27'; // Big plant - mature green
    if (points >= 200) return '#3e8948'; // Medium plant - vibrant green
    if (points >= 50) return '#66b032'; // Small plant - young green
    return '#98bf64'; // Seed/sprout - light green
  }, [points]);

  const leafColor = useMemo(() => {
    // Slightly lighter variant of plantColor for leaves
    if (points >= 1000) return '#2d5a27';
    if (points >= 500) return '#3e8948';
    if (points >= 200) return '#66b032';
    if (points >= 50) return '#98bf64';
    return '#bad87f';
  }, [points]);

  return (
    <div className={`relative flex flex-col items-center gap-2 ${className}`}>
      {/* Points display */}
      <div className='rounded-full bg-[#00e5bf] px-3 py-1 text-xs font-semibold text-black'>
        {points} Points
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
          fill='#3e2723'
          opacity='0.9'
        />
        <path
          d='M15,85 Q35,83 50,85 Q65,87 85,85'
          fill='none'
          stroke='#5d4037'
          strokeWidth='1'
          opacity='0.7'
        />

        {/* Plant growth container */}
        <g
          transform={`scale(${0.3 + (growthPercent * 0.7) / 100}, ${0.3 + (growthPercent * 0.7) / 100})`}
          style={{ transformOrigin: '50px 85px' }}
        >
          {/* Main stem structure - grows organically */}
          <path
            d={`M50,85 C50,${85 - growthPercent * 0.6} 
                ${45 + Math.sin(growthPercent * 0.1) * 10},${55 - growthPercent * 0.4} 
                ${48 + Math.sin(growthPercent * 0.05) * 5},${25}`}
            fill='none'
            stroke={plantColor}
            strokeWidth='4'
            strokeLinecap='round'
          />

          {points >= 50 && (
            <>
              {/* First set of leaves */}
              <path
                d={`M50,70 
                   Q40,65 35,70 
                   Q38,68 42,69
                   M50,70
                   Q60,65 65,70
                   Q62,68 58,69`}
                fill={leafColor}
                stroke={plantColor}
                strokeWidth='1'
                opacity='0.9'
              />
            </>
          )}

          {points >= 200 && (
            <>
              {/* Second set of leaves */}
              <path
                d={`M48,55 
                   Q35,50 30,60 
                   Q34,53 40,54
                   M52,55
                   Q65,50 70,60
                   Q66,53 60,54`}
                fill={leafColor}
                stroke={plantColor}
                strokeWidth='1'
                opacity='0.9'
              />
            </>
          )}

          {points >= 500 && (
            <>
              {/* Third set of leaves - more complex */}
              <path
                d={`M47,40 
                   Q30,35 25,50 
                   Q28,40 35,39
                   M53,40
                   Q70,35 75,50
                   Q72,40 65,39`}
                fill={leafColor}
                stroke={plantColor}
                strokeWidth='1'
                opacity='0.9'
              />
            </>
          )}

          {points >= 1000 && (
            <>
              {/* Tree crown with detailed foliage */}
              <path
                d={`M50,25 
                   Q35,20 30,35 
                   Q25,25 35,15
                   Q45,5 50,10
                   Q55,5 65,15
                   Q75,25 70,35
                   Q65,20 50,25`}
                fill={leafColor}
                stroke={plantColor}
                strokeWidth='1'
                opacity='0.9'
              />
              <path
                d={`M40,20 Q50,15 60,20`}
                fill='none'
                stroke={plantColor}
                strokeWidth='1'
                opacity='0.7'
              />
            </>
          )}
        </g>
      </svg>
    </div>
  );
}
