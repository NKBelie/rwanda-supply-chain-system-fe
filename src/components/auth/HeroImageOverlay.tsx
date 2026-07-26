"use client";

import React from "react";

export function HeroImageOverlay() {
  return (
    <div className="absolute inset-0 z-[1] pointer-events-none">
      {/* Dark forest green overlay for premium look */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'rgba(20, 83, 45, 0.7)'
        }}
      />
      
      {/* Digital network connection lines */}
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          {/* Glow effect for nodes */}
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          
          {/* Gradient for connection lines */}
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.6)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.2)" />
          </linearGradient>
        </defs>
        
        {/* Network connection lines - horizontal and diagonal */}
        <g stroke="url(#lineGradient)" strokeWidth="1.5" fill="none" opacity="0.7">
          {/* Top horizontal line */}
          <line x1="15%" y1="12%" x2="85%" y2="12%" strokeDasharray="4,4" />
          
          {/* Middle horizontal line */}
          <line x1="10%" y1="35%" x2="90%" y2="35%" strokeDasharray="4,4" />
          
          {/* Diagonal connections */}
          <line x1="20%" y1="12%" x2="35%" y2="35%" strokeDasharray="3,3" />
          <line x1="35%" y1="12%" x2="50%" y2="35%" strokeDasharray="3,3" />
          <line x1="50%" y1="12%" x2="65%" y2="35%" strokeDasharray="3,3" />
          <line x1="65%" y1="12%" x2="80%" y2="35%" strokeDasharray="3,3" />
          
          {/* Lower connections */}
          <line x1="25%" y1="35%" x2="40%" y2="55%" strokeDasharray="3,3" />
          <line x1="55%" y1="35%" x2="70%" y2="55%" strokeDasharray="3,3" />
        </g>
        
        {/* Soft glowing connection nodes */}
        <g filter="url(#glow)">
          {/* Top row nodes */}
          <circle cx="20%" cy="12%" r="4" fill="rgba(255,255,255,0.9)" />
          <circle cx="35%" cy="12%" r="4" fill="rgba(255,255,255,0.9)" />
          <circle cx="50%" cy="12%" r="4" fill="rgba(255,255,255,0.9)" />
          <circle cx="65%" cy="12%" r="4" fill="rgba(255,255,255,0.9)" />
          <circle cx="80%" cy="12%" r="4" fill="rgba(255,255,255,0.9)" />
          
          {/* Middle row nodes */}
          <circle cx="25%" cy="35%" r="4" fill="rgba(255,255,255,0.9)" />
          <circle cx="50%" cy="35%" r="4" fill="rgba(255,255,255,0.9)" />
          <circle cx="75%" cy="35%" r="4" fill="rgba(255,255,255,0.9)" />
          
          {/* Lower nodes */}
          <circle cx="40%" cy="55%" r="3" fill="rgba(255,255,255,0.8)" />
          <circle cx="70%" cy="55%" r="3" fill="rgba(255,255,255,0.8)" />
        </g>
        
        {/* Technology Icons - White circles with symbols */}
        <g fill="white" opacity="0.95">
          {/* Cloud icon - top left area */}
          <g transform="translate(20%, 12%)">
            <circle r="18" fill="rgba(255,255,255,0.15)" stroke="white" strokeWidth="1.5" />
            <path d="M-6,-2 Q-6,-6 -2,-6 Q0,-9 4,-9 Q8,-9 10,-6 Q14,-6 14,-2 Q14,2 10,2 L-6,2 Q-10,2 -10,-2 Q-10,-6 -6,-2 Z" fill="white" opacity="0.9" />
          </g>
          
          {/* Analytics/Chart icon - top center */}
          <g transform="translate(35%, 12%)">
            <circle r="18" fill="rgba(255,255,255,0.15)" stroke="white" strokeWidth="1.5" />
            <rect x="-6" y="-2" width="3" height="8" fill="white" opacity="0.9" />
            <rect x="-1" y="-5" width="3" height="11" fill="white" opacity="0.9" />
            <rect x="4" y="-1" width="3" height="7" fill="white" opacity="0.9" />
          </g>
          
          {/* QR Code icon - top right area */}
          <g transform="translate(80%, 12%)">
            <circle r="18" fill="rgba(255,255,255,0.15)" stroke="white" strokeWidth="1.5" />
            <rect x="-7" y="-7" width="5" height="5" fill="white" opacity="0.9" />
            <rect x="2" y="-7" width="5" height="5" fill="white" opacity="0.9" />
            <rect x="-7" y="2" width="5" height="5" fill="white" opacity="0.9" />
            <rect x="-2" y="-2" width="4" height="4" fill="white" opacity="0.9" />
          </g>
          
          {/* GPS Location pin - middle left */}
          <g transform="translate(25%, 35%)">
            <circle r="18" fill="rgba(255,255,255,0.15)" stroke="white" strokeWidth="1.5" />
            <path d="M0,-8 C-4,-8 -7,-5 -7,-2 C-7,3 0,10 0,10 C0,10 7,3 7,-2 C7,-5 4,-8 0,-8 Z" fill="white" opacity="0.9" />
            <circle r="2" cy="-2" fill="rgba(0,60,30,0.9)" />
          </g>
          
          {/* Warehouse icon - middle center */}
          <g transform="translate(50%, 35%)">
            <circle r="18" fill="rgba(255,255,255,0.15)" stroke="white" strokeWidth="1.5" />
            <path d="M-8,2 L-8,-2 L0,-8 L8,-2 L8,2 Z" fill="none" stroke="white" strokeWidth="1.5" opacity="0.9" />
            <rect x="-6" y="2" width="12" height="6" fill="none" stroke="white" strokeWidth="1.5" opacity="0.9" />
            <line x1="-6" y1="5" x2="6" y2="5" stroke="white" strokeWidth="1" opacity="0.9" />
          </g>
          
          {/* Mobile phone icon - middle right */}
          <g transform="translate(75%, 35%)">
            <circle r="18" fill="rgba(255,255,255,0.15)" stroke="white" strokeWidth="1.5" />
            <rect x="-5" y="-7" width="10" height="14" rx="1.5" fill="none" stroke="white" strokeWidth="1.5" opacity="0.9" />
            <line x1="-5" y1="-3" x2="5" y2="-3" stroke="white" strokeWidth="1" opacity="0.9" />
            <circle r="1.5" cy="4" fill="white" opacity="0.9" />
          </g>
        </g>
        
        {/* Additional subtle network dots scattered */}
        <g fill="rgba(255,255,255,0.5)">
          <circle cx="15%" cy="25%" r="2" />
          <circle cx="45%" cy="20%" r="2" />
          <circle cx="70%" cy="28%" r="2" />
          <circle cx="30%" cy="45%" r="2" />
          <circle cx="60%" cy="48%" r="2" />
          <circle cx="85%" cy="42%" r="2" />
        </g>
      </svg>
    </div>
  );
}
