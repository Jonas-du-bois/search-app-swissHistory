<template>
    <div class="loading-container">
      <div class="spinner"></div>
      <p>Traduction et recherche en cours...</p>
    </div>
  </template>
  
  <script>
  export default {
    name: 'LoadingIndicator'
  };
  </script>
  
  <style scoped>
  .loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 40px 0;
  }
  
  .spinner {
    width: 50px;
    height: 50px;
    border: 5px solid rgba(66, 133, 244, 0.2);
    border-radius: 50%;
    border-top-color: #4285f4;
    animation: spin 1s ease-in-out infinite;
    margin-bottom: 15px;
  }
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
  
  p {
    color: #666;
    font-style: italic;
  }
  </style>