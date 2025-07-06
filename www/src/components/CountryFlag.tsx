// 国旗SVGコンポーネント（最終フォールバック用）
export function CountryFlag({ country }: { country: string }) {
  const flagSVGs = {
    'IN': (
      <svg viewBox="0 0 3 2" className="w-full h-full">
        <rect x="0" y="0" width="3" height="0.67" fill="#FF9933"/>
        <rect x="0" y="0.67" width="3" height="0.67" fill="#FFFFFF"/>
        <rect x="0" y="1.33" width="3" height="0.67" fill="#138808"/>
        <circle cx="1.5" cy="1" r="0.3" fill="none" stroke="#000080" strokeWidth="0.05"/>
      </svg>
    ),
    'JP': (
      <svg viewBox="0 0 3 2" className="w-full h-full">
        <rect x="0" y="0" width="3" height="2" fill="#FFFFFF"/>
        <circle cx="1.5" cy="1" r="0.6" fill="#BC002D"/>
      </svg>
    ),
    'US': (
      <svg viewBox="0 0 19 10" className="w-full h-full">
        <rect x="0" y="0" width="19" height="10" fill="#B22234"/>
        <rect x="0" y="0.77" width="19" height="0.77" fill="#FFFFFF"/>
        <rect x="0" y="2.31" width="19" height="0.77" fill="#FFFFFF"/>
        <rect x="0" y="3.85" width="19" height="0.77" fill="#FFFFFF"/>
        <rect x="0" y="5.38" width="19" height="0.77" fill="#FFFFFF"/>
        <rect x="0" y="6.92" width="19" height="0.77" fill="#FFFFFF"/>
        <rect x="0" y="8.46" width="19" height="0.77" fill="#FFFFFF"/>
        <rect x="0" y="0" width="7.6" height="5.38" fill="#3C3B6E"/>
      </svg>
    ),
    'SE': (
      <svg viewBox="0 0 16 10" className="w-full h-full">
        <rect x="0" y="0" width="16" height="10" fill="#006AA7"/>
        <rect x="0" y="4" width="16" height="2" fill="#FECC00"/>
        <rect x="4" y="0" width="2" height="10" fill="#FECC00"/>
      </svg>
    )
  };
  
  return flagSVGs[country as keyof typeof flagSVGs] || null;
}
