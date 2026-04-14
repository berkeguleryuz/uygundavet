"use client";

export function AttendingIcon({ active }: { active: boolean }) {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      className={`transition-transform duration-300 ${active ? "scale-110" : ""}`}
    >
      <circle
        cx="14"
        cy="14"
        r="12"
        stroke={active ? "#34d399" : "#ffffff30"}
        strokeWidth="2"
        fill={active ? "#34d39915" : "none"}
        className="transition-all duration-300"
      />
      <path
        d="M9 14.5L12.5 18L19 10"
        stroke={active ? "#34d399" : "#ffffff40"}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        className="transition-all duration-300"
        style={{
          strokeDasharray: active ? "20" : "20",
          strokeDashoffset: active ? "0" : "20",
          transition: "stroke-dashoffset 0.4s ease, stroke 0.3s ease",
        }}
      />
      {active && (
        <>
          <circle cx="6" cy="6" r="1.5" fill="#34d399" opacity="0.6">
            <animate attributeName="opacity" values="0;0.8;0" dur="1.2s" repeatCount="indefinite" />
            <animate attributeName="r" values="0;2;0" dur="1.2s" repeatCount="indefinite" />
          </circle>
          <circle cx="22" cy="8" r="1" fill="#34d399" opacity="0.4">
            <animate attributeName="opacity" values="0;0.6;0" dur="1s" begin="0.3s" repeatCount="indefinite" />
            <animate attributeName="r" values="0;1.5;0" dur="1s" begin="0.3s" repeatCount="indefinite" />
          </circle>
          <circle cx="24" cy="20" r="1" fill="#34d399" opacity="0.3">
            <animate attributeName="opacity" values="0;0.5;0" dur="1.4s" begin="0.6s" repeatCount="indefinite" />
          </circle>
        </>
      )}
    </svg>
  );
}

export function DeclineIcon({ active }: { active: boolean }) {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      className={`transition-transform duration-300 ${active ? "scale-110" : ""}`}
    >
      <circle
        cx="14"
        cy="14"
        r="12"
        stroke={active ? "#f87171" : "#ffffff30"}
        strokeWidth="2"
        fill={active ? "#f8717115" : "none"}
        className="transition-all duration-300"
      />
      <circle
        cx="10.5"
        cy="12"
        r="1.2"
        fill={active ? "#f87171" : "#ffffff40"}
        className="transition-all duration-300"
      />
      <circle
        cx="17.5"
        cy="12"
        r="1.2"
        fill={active ? "#f87171" : "#ffffff40"}
        className="transition-all duration-300"
      />
      <path
        d="M10 19C11 17 17 17 18 19"
        stroke={active ? "#f87171" : "#ffffff40"}
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
        className="transition-all duration-300"
      />
      {active && (
        <g transform="translate(21, 4)">
          <text
            fontSize="8"
            fill="#f87171"
            opacity="0.7"
          >
            <animate attributeName="opacity" values="0.4;0.8;0.4" dur="1.5s" repeatCount="indefinite" />
            👋
          </text>
        </g>
      )}
    </svg>
  );
}

export function HeartIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <path
        d="M11 19.5C11 19.5 2 14.5 2 8C2 5.5 4 3.5 6.5 3.5C8.5 3.5 10 4.5 11 6C12 4.5 13.5 3.5 15.5 3.5C18 3.5 20 5.5 20 8C20 14.5 11 19.5 11 19.5Z"
        fill="#d5d1ad"
        opacity="0.9"
      >
        <animate attributeName="opacity" values="0.7;1;0.7" dur="2s" repeatCount="indefinite" />
      </path>
      <path
        d="M11 19.5C11 19.5 2 14.5 2 8C2 5.5 4 3.5 6.5 3.5C8.5 3.5 10 4.5 11 6C12 4.5 13.5 3.5 15.5 3.5C18 3.5 20 5.5 20 8C20 14.5 11 19.5 11 19.5Z"
        stroke="#d5d1ad"
        strokeWidth="1"
        fill="none"
      />
    </svg>
  );
}

export function CameraIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="2" y="5" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="10" cy="11" r="3" stroke="currentColor" strokeWidth="1.5" />
      <path d="M7 5L8 3H12L13 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function PenIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M14.5 3.5L16.5 5.5L6 16H4V14L14.5 3.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12.5 5.5L14.5 7.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export function UploadIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <path d="M11 14V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M7 8L11 4L15 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 14V17C4 18.1 4.9 19 6 19H16C17.1 19 18 18.1 18 17V14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function SuccessIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
      <circle cx="24" cy="24" r="22" stroke="#34d399" strokeWidth="2" fill="#34d39910" />
      <path
        d="M15 24L21 30L33 18"
        stroke="#34d399"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        style={{
          strokeDasharray: "30",
          strokeDashoffset: "0",
        }}
      >
        <animate attributeName="stroke-dashoffset" from="30" to="0" dur="0.6s" fill="freeze" />
      </path>
      {[0, 60, 120, 180, 240, 300].map((angle) => (
        <circle
          key={angle}
          cx={24 + Math.cos((angle * Math.PI) / 180) * 20}
          cy={24 + Math.sin((angle * Math.PI) / 180) * 20}
          r="2"
          fill="#d5d1ad"
        >
          <animate attributeName="opacity" values="0;1;0" dur="1.5s" begin="0.4s" repeatCount="indefinite" />
          <animate attributeName="r" values="0;3;0" dur="1.5s" begin="0.4s" repeatCount="indefinite" />
        </circle>
      ))}
    </svg>
  );
}
