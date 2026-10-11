import Svg, { Circle, Path } from "react-native-svg";

/** The AquaCycle mark used above the authentication forms. */
export default function AquaCycleLogo({ size = 68 }) {
  return (
    <Svg accessibilityLabel="AquaCycle" height={size * 0.58} viewBox="0 0 128 74" width={size}>
      <Path d="M7 51c17-13 32-14 47-5 15 9 29 8 48-7 6-5 12-7 20-8-14 16-29 25-45 28-25 5-47 1-70-8Z" fill="#068EE6" />
      <Path d="M13 60c18-8 33-7 46 0 15 8 33 5 57-11-13 15-30 23-49 25-23 2-42-2-54-14Z" fill="#0B67C4" />
      <Circle cx="70" cy="25" fill="none" r="10" stroke="#0A356A" strokeWidth="4" />
      <Circle cx="101" cy="27" fill="none" r="10" stroke="#0A356A" strokeWidth="4" />
      <Path d="m70 25 14-15 11 17-25-2m14-15 12 1m-22-1-6-7m14 7-5-7m8 22 7-17" fill="none" stroke="#0A356A" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />
    </Svg>
  );
}
