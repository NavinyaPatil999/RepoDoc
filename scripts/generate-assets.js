import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

async function generate() {
  console.log('Generating branding image assets...');

  // 1. Logo (public/logo.png)
  const logoSvg = `
  <svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="logoBg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0f766e" />
        <stop offset="50%" stop-color="#0d9488" />
        <stop offset="100%" stop-color="#0284c7" />
      </linearGradient>
      <linearGradient id="pulseGlow" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#5eead4" />
        <stop offset="100%" stop-color="#ffffff" />
      </linearGradient>
      <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#0f766e" flood-opacity="0.35"/>
      </filter>
    </defs>
    <!-- Rounded Shield Background -->
    <rect x="40" y="40" width="432" height="432" rx="108" fill="url(#logoBg)" filter="url(#shadow)"/>
    <circle cx="256" cy="256" r="180" stroke="white" stroke-opacity="0.15" stroke-width="6" stroke-dasharray="8 8" />
    
    <!-- Medical Cross with Pulse Wave -->
    <path d="M228 120 H284 C290 120 294 124 294 130 V200 H364 C370 200 374 204 374 210 V266 C374 272 370 276 364 276 H294 V346 C294 352 290 356 284 356 H228 C222 356 218 352 218 346 V276 H148 C142 276 138 272 138 266 V210 C138 204 142 200 148 200 H218 V130 C218 124 222 120 228 120 Z" fill="white" fill-opacity="0.22" />
    
    <!-- Lungs & Respiration Silhouette in Center -->
    <path d="M210 180 C180 180 150 205 150 250 C150 295 180 340 225 340 C238 340 248 335 256 325 C264 335 274 340 287 340 C332 340 362 295 362 250 C362 205 332 180 302 180 C280 180 266 195 256 208 C246 195 232 180 210 180 Z" stroke="white" stroke-width="14" stroke-linecap="round" stroke-linejoin="round" fill="none" />
    
    <!-- Trachea -->
    <path d="M256 150 V210" stroke="white" stroke-width="14" stroke-linecap="round"/>
    
    <!-- Vital ECG Pulse through Lungs -->
    <path d="M120 265 H195 L215 230 L235 295 L260 215 L285 305 L305 245 L320 265 H392" stroke="url(#pulseGlow)" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
  `;
  await sharp(Buffer.from(logoSvg)).png().toFile(path.join(publicDir, 'logo.png'));
  console.log('✓ Created public/logo.png');

  // 2. Hero Image (public/hero.jpg)
  const heroSvg = `
  <svg width="1280" height="960" viewBox="0 0 1280 960" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="skyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#042f2e" />
        <stop offset="40%" stop-color="#0f766e" />
        <stop offset="85%" stop-color="#0284c7" />
        <stop offset="100%" stop-color="#0369a1" />
      </linearGradient>
      <linearGradient id="accentBeam" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#2dd4bf" stop-opacity="0.35"/>
        <stop offset="100%" stop-color="#2dd4bf" stop-opacity="0"/>
      </linearGradient>
      <linearGradient id="cardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.14"/>
        <stop offset="100%" stop-color="#ffffff" stop-opacity="0.04"/>
      </linearGradient>
    </defs>
    <!-- Background Canvas -->
    <rect width="1280" height="960" fill="url(#skyGrad)"/>
    
    <!-- Architectural Facility Grid & Beams -->
    <path d="M-100 0 L500 960 M200 0 L800 960 M500 0 L1100 960 M800 0 L1400 960" stroke="#14b8a6" stroke-opacity="0.12" stroke-width="2"/>
    <circle cx="640" cy="480" r="420" stroke="white" stroke-opacity="0.06" stroke-width="1.5" />
    <circle cx="640" cy="480" r="280" stroke="#38bdf8" stroke-opacity="0.1" stroke-width="2" stroke-dasharray="10 15" />
    
    <!-- Light cones -->
    <polygon points="640,0 200,960 1080,960" fill="url(#accentBeam)"/>

    <!-- Facility Architecture Silhouette / High-tech Medical Bay Cards -->
    <rect x="160" y="220" width="420" height="320" rx="24" fill="url(#cardGrad)" stroke="#5eead4" stroke-opacity="0.3" stroke-width="1.5"/>
    <rect x="700" y="340" width="440" height="360" rx="24" fill="url(#cardGrad)" stroke="#38bdf8" stroke-opacity="0.3" stroke-width="1.5"/>
    
    <!-- Vital wave overlay in first card -->
    <path d="M190 380 H280 L310 330 L340 430 L370 300 L400 420 L420 360 L440 380 H540" stroke="#2dd4bf" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
    <!-- Metrics in first card -->
    <text x="200" y="275" fill="#5eead4" font-family="Arial, sans-serif" font-size="22" font-weight="bold">QUARANTINE SECTOR B</text>
    <text x="200" y="310" fill="#ccfbf1" font-family="Arial, sans-serif" font-size="16">Capacity: 74 Isolation Beds</text>
    <rect x="200" y="470" width="160" height="36" rx="18" fill="#14b8a6" fill-opacity="0.3"/>
    <text x="220" y="494" fill="#a7f3d0" font-family="Arial, sans-serif" font-size="14" font-weight="bold">ACTIVE TRIAGE</text>
    
    <!-- Second card metrics -->
    <text x="740" y="400" fill="#38bdf8" font-family="Arial, sans-serif" font-size="22" font-weight="bold">CLINICAL PROTOCOL</text>
    <text x="740" y="435" fill="#e0f2fe" font-family="Arial, sans-serif" font-size="16">Fever-Free Discharge Standard: 3 Days</text>
    
    <!-- Bar charts in second card -->
    <rect x="740" y="490" width="40" height="130" rx="8" fill="#38bdf8" fill-opacity="0.8"/>
    <rect x="800" y="450" width="40" height="170" rx="8" fill="#2dd4bf" fill-opacity="0.8"/>
    <rect x="860" y="520" width="40" height="100" rx="8" fill="#818cf8" fill-opacity="0.8"/>
    <rect x="920" y="430" width="40" height="190" rx="8" fill="#34d399" fill-opacity="0.9"/>
    <rect x="980" y="470" width="40" height="150" rx="8" fill="#38bdf8" fill-opacity="0.8"/>

    <!-- Bottom Banner Branding -->
    <rect x="0" y="860" width="1280" height="100" fill="#042f2e" fill-opacity="0.85"/>
    <text x="640" y="920" text-anchor="middle" fill="#ffffff" font-family="Arial, sans-serif" font-size="24" font-weight="bold" letter-spacing="3">RESPO DOC &#8226; 74-BED VIRUS QUARANTINE SYSTEM</text>
  </svg>
  `;
  await sharp(Buffer.from(heroSvg)).jpeg({ quality: 90 }).toFile(path.join(publicDir, 'hero.jpg'));
  console.log('✓ Created public/hero.jpg');

  // Helper for Role Avatar Cards
  const makeRoleAvatar = ({ title, subtitle, badgeColor, iconPath, primaryBg, badgeText }) => `
  <svg width="600" height="600" viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${primaryBg}" />
        <stop offset="100%" stop-color="#0f172a" />
      </linearGradient>
      <radialGradient id="halo" cx="50%" cy="40%" r="50%">
        <stop offset="0%" stop-color="${badgeColor}" stop-opacity="0.3"/>
        <stop offset="100%" stop-color="${badgeColor}" stop-opacity="0"/>
      </radialGradient>
      <filter id="cardShadow" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="16" stdDeviation="20" flood-color="#000000" flood-opacity="0.3"/>
      </filter>
    </defs>
    <!-- Background card -->
    <rect width="600" height="600" rx="48" fill="url(#bgGrad)"/>
    <circle cx="300" cy="240" r="210" fill="url(#halo)"/>

    <!-- Outer Decorative Ring -->
    <circle cx="300" cy="220" r="145" stroke="${badgeColor}" stroke-opacity="0.4" stroke-width="4" stroke-dasharray="8 8"/>
    <circle cx="300" cy="220" r="125" fill="#1e293b" fill-opacity="0.8" stroke="${badgeColor}" stroke-width="4"/>

    <!-- Avatar Icon in Circle -->
    <g transform="translate(180, 100) scale(1.0)">
      ${iconPath}
    </g>

    <!-- Role Badge Pill -->
    <rect x="200" y="380" width="200" height="42" rx="21" fill="${badgeColor}" fill-opacity="0.2" stroke="${badgeColor}" stroke-width="2"/>
    <text x="300" y="407" text-anchor="middle" fill="${badgeColor}" font-family="Arial, sans-serif" font-size="16" font-weight="bold" letter-spacing="2">${badgeText}</text>

    <!-- Title and Subtitle -->
    <text x="300" y="468" text-anchor="middle" fill="#ffffff" font-family="Arial, sans-serif" font-size="36" font-weight="bold">${title}</text>
    <text x="300" y="510" text-anchor="middle" fill="#94a3b8" font-family="Arial, sans-serif" font-size="18">${subtitle}</text>
  </svg>
  `;

  // 3. Nurse (public/nurse.png)
  const nurseIcon = `
    <!-- Thermometer & Nurse Cross -->
    <circle cx="120" cy="90" r="42" fill="#0d9488"/>
    <!-- Head -->
    <circle cx="120" cy="75" r="32" fill="#fed7aa"/>
    <path d="M102 70 Q120 48 138 70 Z" fill="#92400e"/> <!-- Hair -->
    <!-- Cap -->
    <path d="M96 55 H144 V42 C144 38 140 34 136 34 H104 C100 34 96 38 96 42 Z" fill="#ffffff"/>
    <rect x="116" y="40" width="8" height="10" fill="#0d9488"/>
    <rect x="113" y="43" width="14" height="4" fill="#0d9488"/>
    <!-- Body / Scrubs -->
    <path d="M80 140 C80 115 100 102 120 102 C140 102 160 115 160 140 V170 H80 Z" fill="#14b8a6"/>
    <!-- Digital Infrared Thermometer in Hand -->
    <rect x="150" y="105" width="24" height="42" rx="6" fill="#f8fafc" stroke="#0f766e" stroke-width="3"/>
    <rect x="156" y="112" width="12" height="14" rx="2" fill="#22c55e"/>
    <path d="M162 95 V105" stroke="#0f766e" stroke-width="5" stroke-linecap="round"/>
  `;
  const nurseSvg = makeRoleAvatar({
    title: 'Nurse Station',
    subtitle: 'Daily Temperature Triage &amp; Logging',
    badgeColor: '#14b8a6',
    primaryBg: '#134e4a',
    iconPath: nurseIcon,
    badgeText: 'CLINICAL NURSE'
  });
  await sharp(Buffer.from(nurseSvg)).png().toFile(path.join(publicDir, 'nurse.png'));
  console.log('✓ Created public/nurse.png');

  // 4. Doctor (public/doctor.png)
  const doctorIcon = `
    <!-- Doctor Head & Coat -->
    <circle cx="120" cy="75" r="32" fill="#fed7aa"/>
    <path d="M98 68 Q120 44 142 68 Z" fill="#334155"/> <!-- Hair -->
    <!-- White Lab Coat & Tie -->
    <path d="M78 140 C78 115 100 102 120 102 C140 102 162 115 162 140 V170 H78 Z" fill="#f8fafc"/>
    <polygon points="120,102 110,140 130,140" fill="#0284c7"/>
    <!-- Stethoscope -->
    <path d="M96 110 Q94 145 110 152 Q120 155 130 152 Q144 145 144 110" stroke="#475569" stroke-width="5" fill="none" stroke-linecap="round"/>
    <circle cx="120" cy="160" r="10" fill="#0284c7" stroke="#ffffff" stroke-width="3"/>
    <path d="M120 152 V160" stroke="#475569" stroke-width="4"/>
  `;
  const doctorSvg = makeRoleAvatar({
    title: 'Attending Physician',
    subtitle: 'Rounds, Review &amp; Discharge Orders',
    badgeColor: '#38bdf8',
    primaryBg: '#075985',
    iconPath: doctorIcon,
    badgeText: 'PHYSICIAN / MD'
  });
  await sharp(Buffer.from(doctorSvg)).png().toFile(path.join(publicDir, 'doctor.png'));
  console.log('✓ Created public/doctor.png');

  // 5. Admin (public/admin.png)
  const adminIcon = `
    <!-- Facility Director / Lead -->
    <circle cx="120" cy="75" r="32" fill="#ffedd5"/>
    <path d="M98 68 Q120 46 142 68 Z" fill="#1e293b"/> <!-- Hair -->
    <!-- Suit / Blazer -->
    <path d="M78 140 C78 115 100 102 120 102 C140 102 162 115 162 140 V170 H78 Z" fill="#1e293b"/>
    <polygon points="120,102 114,130 126,130" fill="#818cf8"/>
    <!-- Digital Dashboard Tablet / Facility Pad -->
    <rect x="140" y="110" width="36" height="48" rx="4" fill="#0f172a" stroke="#818cf8" stroke-width="3"/>
    <rect x="146" y="116" width="24" height="26" fill="#38bdf8" rx="2" fill-opacity="0.8"/>
    <circle cx="158" cy="150" r="2.5" fill="#818cf8"/>
  `;
  const adminSvg = makeRoleAvatar({
    title: 'Facility Admin',
    subtitle: 'Bed Occupancy, Admissions &amp; Metrics',
    badgeColor: '#a855f7',
    primaryBg: '#581c87',
    iconPath: adminIcon,
    badgeText: 'ADMINISTRATOR'
  });
  await sharp(Buffer.from(adminSvg)).png().toFile(path.join(publicDir, 'admin.png'));
  console.log('✓ Created public/admin.png');

  // 6. Empty State (public/empty.png)
  const emptySvg = `
  <svg width="600" height="600" viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="emptyBg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#f0fdfa" />
        <stop offset="100%" stop-color="#e0f2fe" />
      </linearGradient>
      <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="16" stdDeviation="24" flood-color="#0d9488" flood-opacity="0.12"/>
      </filter>
    </defs>
    <!-- Background circle -->
    <circle cx="300" cy="270" r="210" fill="url(#emptyBg)"/>
    <circle cx="300" cy="270" r="170" stroke="#14b8a6" stroke-opacity="0.25" stroke-width="4" stroke-dasharray="10 10"/>

    <!-- Medical Clipboard with all checked items -->
    <g filter="url(#softGlow)" transform="translate(185, 120)">
      <!-- Board -->
      <rect x="0" y="40" width="230" height="290" rx="20" fill="#ffffff" stroke="#cbd5e1" stroke-width="4"/>
      <!-- Clip -->
      <rect x="65" y="20" width="100" height="40" rx="10" fill="#64748b"/>
      <circle cx="115" cy="35" r="8" fill="#ffffff"/>
      <!-- Checked lines -->
      <circle cx="45" cy="100" r="12" fill="#22c55e"/>
      <path d="M39 100 L43 104 L51 96" stroke="#ffffff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      <rect x="70" y="94" width="125" height="12" rx="6" fill="#e2e8f0"/>

      <circle cx="45" cy="150" r="12" fill="#22c55e"/>
      <path d="M39 150 L43 154 L51 146" stroke="#ffffff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      <rect x="70" y="144" width="110" height="12" rx="6" fill="#e2e8f0"/>

      <circle cx="45" cy="200" r="12" fill="#22c55e"/>
      <path d="M39 200 L43 204 L51 196" stroke="#ffffff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      <rect x="70" y="194" width="135" height="12" rx="6" fill="#e2e8f0"/>

      <circle cx="45" cy="250" r="12" fill="#22c55e"/>
      <path d="M39 250 L43 254 L51 246" stroke="#ffffff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      <rect x="70" y="244" width="95" height="12" rx="6" fill="#e2e8f0"/>
    </g>

    <!-- Star / celebration sparkles -->
    <path d="M140 180 Q150 180 150 170 Q150 180 160 180 Q150 180 150 190 Q150 180 140 180" fill="#f59e0b"/>
    <path d="M450 140 Q465 140 465 125 Q465 140 480 140 Q465 140 465 155 Q465 140 450 140" fill="#14b8a6"/>
    <path d="M430 380 Q440 380 440 370 Q440 380 450 380 Q440 380 440 390 Q440 380 430 380" fill="#38bdf8"/>

    <!-- Bottom text -->
    <text x="300" y="490" text-anchor="middle" fill="#0f172a" font-family="Arial, sans-serif" font-size="28" font-weight="bold">All Caught Up!</text>
    <text x="300" y="525" text-anchor="middle" fill="#64748b" font-family="Arial, sans-serif" font-size="18">No pending records found in this queue</text>
  </svg>
  `;
  await sharp(Buffer.from(emptySvg)).png().toFile(path.join(publicDir, 'empty.png'));
  console.log('✓ Created public/empty.png');

  console.log('All image assets generated successfully!');
}

generate().catch(err => {
  console.error(err);
  process.exit(1);
});
