const MathDoodleBackground = () => {
  const leftFormulas = [
    "y = mx + c",
    "∫ f(x)dx",
    "sin²θ + cos²θ = 1",
    "E = mc²",
    "πr²",
    "tan(x)",
    "Σ n = n(n+1)/2",
    "dy/dx",
    "√(a² + b²)",
    "lim x→0",
  ];

  const rightFormulas = [
    "A² + B² = ?",
    "F = ma",
    "x = -b±√(b²-4ac)/2a",
    "log₁₀",
    "∂/∂x",
    "S = n-1",
    "cos(θ)",
    "∮ E·dA",
    "ΔG = ΔH - TΔS",
    "PV = nRT",
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Left side doodles */}
      <div className="absolute left-0 top-0 bottom-0 w-72 opacity-40">
        <div 
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, 
              hsl(145 40% 92% / 0.9) 0%, 
              hsl(30 50% 94% / 0.7) 50%, 
              transparent 100%)`,
          }}
        />
        <div className="relative p-4 text-foreground/30 font-body text-sm">
          {leftFormulas.map((formula, i) => (
            <div
              key={i}
              className="mb-4"
              style={{
                transform: `rotate(${Math.random() * 20 - 10}deg) translateX(${Math.random() * 40}px)`,
                marginTop: `${Math.random() * 20}px`,
              }}
            >
              {formula}
            </div>
          ))}
        </div>
      </div>

      {/* Right side doodles */}
      <div className="absolute right-0 top-0 bottom-0 w-72 opacity-40">
        <div 
          className="absolute inset-0"
          style={{
            background: `linear-gradient(-135deg, 
              hsl(210 50% 94% / 0.9) 0%, 
              hsl(330 50% 96% / 0.7) 50%, 
              transparent 100%)`,
          }}
        />
        <div className="relative p-4 text-foreground/30 font-body text-sm text-right">
          {rightFormulas.map((formula, i) => (
            <div
              key={i}
              className="mb-4"
              style={{
                transform: `rotate(${Math.random() * 20 - 10}deg) translateX(${-Math.random() * 40}px)`,
                marginTop: `${Math.random() * 20}px`,
              }}
            >
              {formula}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MathDoodleBackground;