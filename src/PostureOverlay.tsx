import React, { useEffect, useState } from 'react';
import { StyleSheet, Animated } from 'react-native';
import { accelerometer } from 'react-native-sensors';
import { map } from 'rxjs/operators';
import { getZAxisAngle } from './postureUtils';

export interface PostureOverlayProps {
  goodAngleThreshold?: number;
  badAngleThreshold?: number;
  maxOpacity?: number;
  overlayColor?: string;
}

const PostureOverlay: React.FC<PostureOverlayProps> = ({
  goodAngleThreshold = 30,
  badAngleThreshold = 60,
  maxOpacity = 1,
  overlayColor = '#000',
}) => {
  const [opacity] = useState(new Animated.Value(0));

  useEffect(() => {
    let latestAngle = 0;

    const subscription = accelerometer
      .pipe(map(({ x, y, z }) => getZAxisAngle(x, y, z)))
      .subscribe((angle) => {
        latestAngle = angle;
      });

    const interval = setInterval(() => {
      let targetOpacity = 0;

      if (latestAngle >= goodAngleThreshold) {
        targetOpacity = 0;
      } else if (latestAngle <= badAngleThreshold) {
        targetOpacity = maxOpacity;
      } else {
        const ratio = (goodAngleThreshold - latestAngle) / (goodAngleThreshold - badAngleThreshold);
        targetOpacity = ratio * maxOpacity;
      }

      Animated.timing(opacity, {
        toValue: targetOpacity,
        duration: 500,
        useNativeDriver: true,
      }).start();

      console.log(latestAngle);
    }, 1000);

    return () => {
      subscription.unsubscribe();
      clearInterval(interval);
    };
  }, [goodAngleThreshold, badAngleThreshold, maxOpacity]);

  return (
    <Animated.View
      style={[
        StyleSheet.absoluteFill,
        { backgroundColor: overlayColor, opacity, zIndex: 9999 },
      ]}
      pointerEvents="none"
    />
  );
};

export default PostureOverlay;
