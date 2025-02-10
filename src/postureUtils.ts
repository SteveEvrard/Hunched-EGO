/**
 * Calculates the angle (in degrees) between the device's "up" vector and the Z-axis.
 * The returned angle is in the range [0, 90], where:
 *  - 0° means the device is fully upright (Z-axis aligned with gravity).
 *  - 90° means the device is on its side.
 */
import { Platform } from 'react-native';

export function getZAxisAngle(x: number, y: number, z: number): number {
  const magnitude = Math.sqrt(x * x + y * y + z * z);
  if (magnitude === 0) {
    return 0; // Fallback if something goes wrong
  }

  // Calculate the tilt angle
  const verticalTiltAngle =
    Platform.OS === 'ios'
      ? 90 - (Math.atan2(-z, Math.sqrt(x * x + y * y)) * 180) / Math.PI
      : (Math.atan2(Math.sqrt(x * x + y * y), z) * 180) / Math.PI;

  // Clamp the angle between 0 and 90 degrees
  return Math.max(0, Math.min(verticalTiltAngle, 90));
}