import React, { useState, useCallback } from 'react';
import styled from 'styled-components';

type ImageLoaderProps = {
  imageUrl: string;
  alt: string;
  isContentLoaded: boolean;
  onLoad: () => void;
  onError: () => void;
  inView: boolean;
};

const ImageLoader: React.FC<ImageLoaderProps> = ({
  imageUrl,
  alt,
  isContentLoaded,
  onLoad,
  onError,
  inView,
}) => {
  const [isImageLoaded, setImageLoaded] = useState(false);

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
    onLoad();
  }, [onLoad]);

  if (!isContentLoaded) return <Placeholder isLoaded={false} />;

  return (
    <ImageWrapper>
      {inView && (
        <>
          <ProductImage
            src={`${imageUrl}?format=webp&width=800`}
            srcSet={`${imageUrl}?format=webp&width=320 320w, ${imageUrl}?format=webp&width=480 480w, ${imageUrl}?format=webp&width=800 800w`}
            sizes="(max-width: 600px) 320px, (max-width: 900px) 480px, 800px"
            alt={alt}
            onLoad={handleImageLoad}
            onError={onError}
            isLoaded={isImageLoaded}
          />
          {!isImageLoaded && <Placeholder isLoaded={isImageLoaded} />}
        </>
      )}
      {!inView && <Placeholder isLoaded={false} />}
    </ImageWrapper>
  );
};

// Styled components for ImageLoader
const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 160px;
  overflow: hidden;
  border-radius: 20px;
  margin-bottom: 10px;
`;

const ProductImage = styled.img<{ isLoaded: boolean }>`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 20px;
  opacity: ${({ isLoaded }) => (isLoaded ? 1 : 0)};
  transition: opacity 0.3s ease-in-out;
`;

const Placeholder = styled.div<{ isLoaded: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #f0f0f0;
  border-radius: 20px;
  opacity: ${({ isLoaded }) => (isLoaded ? 0 : 1)};
  transition: opacity 0.3s ease-in-out;
  z-index: 1;
`;

export default ImageLoader;
