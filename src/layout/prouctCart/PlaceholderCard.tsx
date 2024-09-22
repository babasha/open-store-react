import React from 'react';
import { PlaceholderCart, PlaceholderImage, PlaceholderContent, PlaceholderControls, LoadWrapper, Activity } from './ProductCartStyles';

const PlaceholderCard: React.FC = () => (
  <PlaceholderCart>
    <PlaceholderImage>
      <LoadWrapper>
        <Activity />
      </LoadWrapper>
    </PlaceholderImage>
    <PlaceholderContent>
      <LoadWrapper>
        <Activity />
      </LoadWrapper>
    </PlaceholderContent>
    <PlaceholderControls>
      <LoadWrapper>
        <Activity />
      </LoadWrapper>
    </PlaceholderControls>
  </PlaceholderCart>
);

export default PlaceholderCard;
