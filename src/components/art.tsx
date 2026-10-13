"use client";
import { cn } from "@/lib/utils";
import { motion, useReducedMotion } from "motion/react";
import { softSpring } from "@/lib/motion";
export type Emotion =
  | "happy"
  | "thinking"
  | "celebrating"
  | "surprised"
  | "encouraging"
  | "sleeping"
  | "trophy"
  | "saving"
  | "sad-but-supportive"
  | "victory";
export function Mascot({
  emotion = "happy",
  size = "md",
  animated = false,
}: {
  emotion?: Emotion;
  size?: "sm" | "md" | "lg";
  animated?: boolean;
}) {
  const reduce = useReducedMotion();
  const celebrating = ["celebrating", "trophy", "victory"].includes(emotion);
  return (
    <motion.svg
      key={emotion}
      initial={{ y: 0, rotate: 0 }}
      animate={
        reduce
          ? { y: 0, rotate: 0 }
          : celebrating
            ? { y: [0, -10, 0], rotate: [0, -4, 3, 0] }
            : { y: 0, rotate: emotion === "thinking" ? -3 : 0 }
      }
      transition={
        celebrating ? { duration: 0.65, ease: "easeOut" } : softSpring
      }
      className={cn(
        "mascot",
        `mascot-${size}`,
        animated && !reduce && "mascot-animated",
      )}
      viewBox="0 0 240 260"
      role="img"
      aria-label={`Koini ${emotion}`}
    >
      <ellipse cx="120" cy="238" rx="65" ry="12" fill="#173b42" opacity=".1" />
      <path
        d="M78 189 66 224M156 189 169 224"
        stroke="#885620"
        strokeWidth="12"
        strokeLinecap="round"
      />
      <path
        d="M65 218q-30-3-29 15q6 11 41 3l2-17M167 218q30-3 32 14q-6 12-40 4l-3-17"
        fill="#245de8"
        stroke="#1745b8"
        strokeWidth="3"
      />
      <path
        d={
          celebrating
            ? "M55 126Q18 110 24 75M181 120q36-11 31-48"
            : "M56 127Q20 141 24 159M179 126q32 15 33-15"
        }
        fill="none"
        stroke="#b77923"
        strokeWidth="11"
        strokeLinecap="round"
      />
      <g fill="#fffdf4" stroke="#c7b890" strokeWidth="2">
        <ellipse cx="24" cy={celebrating ? 72 : 160} rx="14" ry="17" />
        <ellipse cx="212" cy={celebrating ? 69 : 107} rx="14" ry="17" />
      </g>
      <ellipse
        cx="125"
        cy="123"
        rx="80"
        ry="84"
        fill="#de9325"
        stroke="#9c651c"
        strokeWidth="3"
      />
      <ellipse
        cx="116"
        cy="119"
        rx="78"
        ry="84"
        fill="#ffbd24"
        stroke="#d68a20"
        strokeWidth="3"
      />
      <ellipse
        cx="116"
        cy="119"
        rx="64"
        ry="70"
        fill="#ffdc4d"
        stroke="#ffe995"
        strokeWidth="4"
      />
      <path
        d="M67 92q13-27 34-28"
        fill="none"
        stroke="#fff0ad"
        strokeWidth="8"
        strokeLinecap="round"
      />
      <path
        d={
          emotion === "thinking"
            ? "M83 91l14-5M135 90q8-7 16-2"
            : "M80 91q9-9 18-4M132 87q10-6 19 4"
        }
        fill="none"
        stroke="#795028"
        strokeWidth="4"
        strokeLinecap="round"
      />
      {emotion === "sleeping" ? (
        <path
          d="M80 111q10 8 20 0M132 111q10 8 20 0"
          fill="none"
          stroke="#583c28"
          strokeWidth="5"
        />
      ) : (
        <g className={animated ? "mascot-eyes" : undefined}>
          <ellipse cx="91" cy="113" rx="9" ry="14" fill="#513b2c" />
          <ellipse cx="141" cy="113" rx="9" ry="14" fill="#513b2c" />
          <circle cx="94" cy="109" r="3.5" fill="white" />
          <circle cx="144" cy="109" r="3.5" fill="white" />
        </g>
      )}
      <ellipse cx="72" cy="138" rx="12" ry="7" fill="#ff8e59" />
      <ellipse cx="159" cy="138" rx="12" ry="7" fill="#ff8e59" />
      {emotion === "surprised" ? (
        <ellipse cx="115" cy="147" rx="9" ry="13" fill="#74432c" />
      ) : emotion === "sad-but-supportive" || emotion === "encouraging" ? (
        <path
          d="M101 147q15 15 30 0"
          fill="none"
          stroke="#79432c"
          strokeWidth="4"
          strokeLinecap="round"
        />
      ) : (
        <path d="M96 141q20 12 39-1q-3 33-22 28q-15-3-17-27" fill="#79432c" />
      )}
      <path d="M105 162q9-12 21-3q-8 12-21 3" fill="#f48a7b" />
      {emotion === "thinking" && (
        <text x="182" y="40" fontSize="34" fill="#245de8">
          ?
        </text>
      )}
      {emotion === "sleeping" && (
        <text x="175" y="45" fontSize="25" fill="#245de8">
          Zz
        </text>
      )}
      {(emotion === "trophy" || emotion === "victory") && (
        <g transform="translate(161 149) scale(.5)">
          <path
            d="M0 0h80v40q-40 48-80 0Z"
            fill="#ffb634"
            stroke="#ab7221"
            strokeWidth="5"
          />
          <path d="M40 66v30M17 99h48" stroke="#ab7221" strokeWidth="9" />
        </g>
      )}
      {emotion === "saving" && (
        <g transform="translate(113 164)">
          <rect
            width="63"
            height="62"
            rx="15"
            fill="#96dcd4"
            stroke="#245de8"
            strokeWidth="3"
          />
          <path d="M17 10h29" stroke="#245de8" strokeWidth="5" />
          <text x="19" y="44" fill="#245de8" fontSize="25">
            ★
          </text>
        </g>
      )}
    </motion.svg>
  );
}
export function TopicArt({
  index,
  className,
}: {
  index: number;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 220 160"
      className={cn("topic-art", className)}
      aria-hidden="true"
    >
      <ellipse cx="111" cy="139" rx="66" ry="9" fill="#173b42" opacity=".1" />
      {index === 0 && (
        <g>
          <g transform="rotate(-13 110 75)">
            <rect
              x="32"
              y="35"
              width="138"
              height="79"
              rx="10"
              fill="#47d997"
              stroke="#13865d"
              strokeWidth="3"
            />
            <rect
              x="42"
              y="44"
              width="118"
              height="59"
              rx="5"
              fill="none"
              stroke="#b1f5cc"
              strokeWidth="3"
            />
            <ellipse cx="102" cy="73" rx="24" ry="25" fill="#b1f5cc" />
            <text x="77" y="81" fontSize="20" fontWeight="900" fill="#13865d">
              5.000
            </text>
          </g>
          <circle
            cx="146"
            cy="112"
            r="30"
            fill="#ffcb4c"
            stroke="#db9827"
            strokeWidth="4"
          />
          <circle
            cx="146"
            cy="112"
            r="22"
            fill="none"
            stroke="#ffeb98"
            strokeWidth="3"
          />
          <text x="134" y="121" fontSize="24" fontWeight="900" fill="#a96d1e">
            Rp
          </text>
        </g>
      )}
      {index === 1 && (
        <g>
          <path
            d="M45 57h133l-13 60H59Z"
            fill="#ffad4e"
            stroke="#d87837"
            strokeWidth="4"
          />
          <path
            d="M55 55 45 38H30M74 68v35M110 68v35M145 68v35"
            stroke="#b66b38"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <circle cx="74" cy="130" r="8" fill="#537976" />
          <circle cx="151" cy="130" r="8" fill="#537976" />
          <rect
            x="66"
            y="24"
            width="36"
            height="50"
            rx="5"
            fill="#93cfd7"
            transform="rotate(-12 66 24)"
          />
          <path
            d="M113 58q-18-35 7-37q14 3 11 12q14-17 26-4q14 18-10 36"
            fill="#f1797d"
          />
          <path d="M135 27q-3-17 12-20" stroke="#439567" strokeWidth="5" />
        </g>
      )}
      {index === 2 && (
        <g>
          <rect
            x="64"
            y="45"
            width="91"
            height="88"
            rx="22"
            fill="#b5e8eb"
            stroke="#5aabb5"
            strokeWidth="3"
          />
          <path
            d="M68 90q38-12 83 0v24q0 17-20 17H85q-17 0-17-17Z"
            fill="#ffcf58"
          />
          <rect x="68" y="35" width="83" height="19" rx="7" fill="#70bdc8" />
          <path
            d="M95 43h30"
            stroke="#3d8398"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <circle cx="110" cy="103" r="17" fill="#ffe58b" />
          <text x="100" y="110" fill="#ad8027" fontSize="22">
            ★
          </text>
          <circle
            cx="112"
            cy="15"
            r="13"
            fill="#ffd365"
            stroke="#dba22f"
            strokeWidth="3"
          />
        </g>
      )}
      {index === 3 && (
        <g>
          <path
            d="M108 75C30 30 81-8 109 29C141-8 187 35 108 75Z"
            fill="#ed7c98"
            stroke="#c65d89"
            strokeWidth="3"
          />
          <path
            d="m40 107 28-29q7-8 16 0l24 22 21-22q8-9 17-1l34 30-26 29-37-16-32 16Z"
            fill="#f8c08b"
            stroke="#d99164"
            strokeWidth="3"
          />
          <path
            d="m31 98 28 27-19 18-28-28M177 94l-28 31 22 17 27-29"
            fill="#9786d5"
          />
          <path
            d="m84 93 22 20q7 7 15-1l15-16"
            fill="none"
            stroke="#d99164"
            strokeWidth="3"
          />
        </g>
      )}
      {index === 4 && (
        <g>
          <circle
            cx="108"
            cy="80"
            r="55"
            fill="#f19c74"
            stroke="#c27756"
            strokeWidth="3"
          />
          <circle cx="108" cy="80" r="39" fill="#fff4d1" />
          <circle cx="108" cy="80" r="25" fill="#eea078" />
          <circle cx="108" cy="80" r="11" fill="#fff4d1" />
          <path
            d="m108 80 62-53"
            stroke="#337e7a"
            strokeWidth="7"
            strokeLinecap="round"
          />
          <path d="m164 34 1-25 15 12 17 1-19 18Z" fill="#67b4a2" />
          <path
            d="m77 129-8 15M139 129l8 15"
            stroke="#9d8055"
            strokeWidth="7"
          />
        </g>
      )}
      {index === 5 && (
        <g>
          <path
            d="M42 44q34-19 68 0q34-19 68 0v86q-34-18-68 0q-34-18-68 0Z"
            fill="#f9f7df"
            stroke="#7774c6"
            strokeWidth="4"
          />
          <path
            d="M110 45v82M55 63h39M55 78h39M55 93h26M125 94h39M125 108h29"
            stroke="#c8c5d8"
            strokeWidth="3"
          />
          <path
            d="m145 45 6 14 16 1-12 11 4 16-14-9-14 9 4-16-12-11 16-1Z"
            fill="#ffc950"
            stroke="#dda339"
            strokeWidth="2"
          />
        </g>
      )}
      <path d="m33 22 3 7 8 2-8 3-3 7-3-7-7-3 7-2Z" fill="#ffca57" />
      <circle cx="186" cy="76" r="3" fill="#fff" />
    </svg>
  );
}
export function AdventureArt() {
  const reduce = useReducedMotion();
  return (
    <div
      className="adventure-art"
      aria-label="Koini menjelajahi pulau menabung yang hijau"
      role="img"
    >
      <svg className="island-scene" viewBox="0 0 640 440" aria-hidden="true">
        <g className="scene-clouds" fill="#fff" opacity=".85">
          <path d="M40 79q-8-24 16-25q7-34 38-16q27-3 27 22q30 0 24 19Z" />
          <path d="M428 57q-2-23 19-24q9-28 34-13q26-6 30 20q25-2 25 17Z" />
        </g>
        <path
          d="M45 321Q13 266 93 228Q173 174 283 210Q386 172 524 228Q623 263 592 323Q543 409 289 418Q118 409 45 321"
          fill="#4dd9a4"
        />
        <path
          d="M54 318q31 76 198 95q248 16 328-89l-20 51q-67 64-281 61Q96 427 66 372Z"
          fill="#edb568"
        />
        <path
          d="M45 299Q12 254 96 221Q205 175 282 208Q396 165 523 218Q629 256 591 301Q548 375 288 382Q126 376 45 299"
          fill="#64e6aa"
          stroke="#25b47e"
          strokeWidth="3"
        />
        <path
          d="M81 304q68-59 163-20t150-11q61-40 151 0"
          fill="none"
          stroke="#fff19b"
          strokeWidth="32"
          strokeLinecap="round"
        />
        <g stroke="#158c79" strokeWidth="7">
          <path d="M87 223v-67M533 234v-74M478 207v-72" />
        </g>
        <g fill="#11b993">
          <circle cx="83" cy="139" r="32" />
          <circle cx="67" cy="165" r="29" />
          <circle cx="102" cy="166" r="30" />
          <circle cx="532" cy="137" r="30" />
          <circle cx="514" cy="163" r="28" />
          <circle cx="549" cy="164" r="26" />
          <circle cx="478" cy="118" r="25" />
          <circle cx="467" cy="141" r="24" />
          <circle cx="492" cy="141" r="22" />
        </g>
        <g fill="#fff1a0">
          <circle cx="150" cy="327" r="5" />
          <circle cx="438" cy="338" r="5" />
          <circle cx="478" cy="312" r="5" />
        </g>
        <g transform="translate(423 206) rotate(9)">
          <rect
            width="71"
            height="87"
            rx="18"
            fill="#84ddff"
            stroke="#2e9bc9"
            strokeWidth="3"
          />
          <rect x="4" y="-6" width="63" height="16" rx="5" fill="#2b87d3" />
          <path d="M23 0h23" stroke="#1b5a9e" strokeWidth="4" />
          <path
            d="M4 50q30-11 64 0v20q0 14-15 14H20Q4 84 4 69Z"
            fill="#ffcd64"
          />
          <text x="23" y="66" fontSize="27" fill="#bf8b32">
            ★
          </text>
        </g>
        <g transform="translate(145 232) rotate(-13)">
          <rect width="68" height="16" rx="4" fill="#9e7df4" />
          <rect y="17" x="-9" width="71" height="16" rx="4" fill="#fff1ae" />
          <rect y="34" width="76" height="17" rx="4" fill="#ff735e" />
        </g>
        <path
          d="M398 131V71l40 10-40 19"
          fill="#ff735e"
          stroke="#a88048"
          strokeWidth="4"
        />
        <g
          className="scene-stars"
          fill="#ffcd51"
          stroke="#d9a138"
          strokeWidth="2"
        >
          <path d="m182 95 7 15 17 2-12 12 3 17-15-8-15 8 3-17-12-12 17-2Z" />
          <path d="m425 151 6 12 14 2-10 10 2 14-12-7-12 7 3-14-10-10 13-2Z" />
          <ellipse
            cx="503"
            cy="83"
            rx="11"
            ry="17"
            transform="rotate(25 503 83)"
          />
          <ellipse
            cx="123"
            cy="191"
            rx="10"
            ry="15"
            transform="rotate(-23 123 191)"
          />
        </g>
      </svg>
      <motion.div
        className="hero-koini"
        initial={{ opacity: 0, y: reduce ? 0 : 20, rotate: -9 }}
        animate={{ opacity: 1, y: 0, rotate: -9 }}
        transition={{ ...softSpring, delay: 0.18 }}
      >
        <Mascot size="lg" emotion="happy" animated />
      </motion.div>
      <div className="floating-coins" aria-hidden="true">
        <span>Rp</span>
        <span>★</span>
        <span>Rp</span>
      </div>
      <div className="speech">
        Hai, aku Koini! <span>Yuk, belajar bareng!</span>
      </div>
      <div className="art-reward">
        <span>★</span> Belajar seru, makin cerdas!
      </div>
    </div>
  );
}
