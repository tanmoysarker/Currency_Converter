import {
    AU, US, EU, GB, JP, NZ, CA, CN, SG                
  } from "country-flag-icons/react/3x2";
  
  const FLAG_COMPONENTS: Record<
    string,
    React.ComponentType<any> | undefined
  > = {
    AUD: AU,
    USD: US,
    EUR: EU,
    GBP: GB,
    JPY: JP,
    NZD: NZ,
    CAD: CA,
    CNY: CN,
    SGD: SG,
  };
  
  interface FlagProps {
    code?: string;
    size?: number;
    className?: string;
    style?: React.CSSProperties;
  }
  
  export default function Flag({ code, size = 18, className = "", style }: FlagProps) {
    const Comp = code ? FLAG_COMPONENTS[code] : undefined;
    
    if (!Comp) return null;
    
    return (
      <Comp
        aria-label={code}
        className={className}
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          marginRight: 8,
          verticalAlign: "middle",
          ...style,
        }}
      />
    );
  }