import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaSearch } from 'react-icons/fa';

const SearchBoxContainer = styled(motion.div)`
  width: 30px;
  border-radius: 15px;
  background: black;
  overflow: hidden;
  cursor: pointer;
  margin-bottom: 30px;
  transition: all 0.3s;
`;

const SearchBoxInner = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 3px;
`;

const SearchInput = styled.input`
  display: none;
  height: 18px;
  width: 87.2%;
  background: white;
  border: none;
  border-radius: 15px;
  padding-left: 15px;
  padding-right: 15px;
`;

const SearchButton = styled.button`
  width: 100%;
  background: transparent;
  border: none;
  color: white;
  transform: translate(-3px, -1px);
  cursor: pointer;
`;

const SearchBoxEnd = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export const SearchBox = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <SearchBoxContainer
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      animate={{ width: isHovered ? '250px' : '30px' }}
    >
      <SearchBoxInner>
        <SearchInput
          style={{ display: isHovered ? 'unset' : 'none' }}
          type="text"
          name="search"
        />
        <SearchButton type="submit" style={{ width: isHovered ? '12.8%' : '100%' }}>
          <FaSearch />
        </SearchButton>
      </SearchBoxInner>
    </SearchBoxContainer>
  );
};

;
