<template>
    <div class="search-form">
      <form @submit.prevent="submitSearch">
        <div class="input-group">
          <input 
            type="text" 
            v-model="query" 
            placeholder="Entrez votre recherche..." 
            :disabled="isLoading"
            ref="searchInput"
          />
          <button type="submit" :disabled="isLoading || !query.trim()">
            {{ isLoading ? 'Recherche en cours...' : 'Rechercher' }}
          </button>
        </div>
        <div class="search-hint">
          Entrez votre recherche dans n'importe quelle langue - elle sera traduite en anglais pour la recherche.
        </div>
      </form>
    </div>
  </template>
  
  <script>
  export default {
    name: 'SearchForm',
    props: {
      isLoading: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        query: ''
      };
    },
    methods: {
      submitSearch() {
        if (this.query.trim() && !this.isLoading) {
          this.$emit('search', this.query.trim());
        }
      }
    },
    mounted() {
      this.$refs.searchInput.focus();
    }
  };
  </script>
  
  <style scoped>
  .search-form {
    margin-bottom: 30px;
  }
  
  .input-group {
    display: flex;
    margin-bottom: 10px;
  }
  
  input {
    flex: 1;
    padding: 12px 15px;
    font-size: 16px;
    border: 1px solid #ddd;
    border-radius: 4px 0 0 4px;
    outline: none;
  }
  
  button {
    padding: 12px 20px;
    background-color: #4285f4;
    color: white;
    font-size: 16px;
    border: none;
    border-radius: 0 4px 4px 0;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  button:hover:not(:disabled) {
    background-color: #3367d6;
  }
  
  button:disabled {
    background-color: #b0c0d6;
    cursor: not-allowed;
  }
  
  .search-hint {
    color: #757575;
    font-size: 14px;
    margin-top: 5px;
  }
  </style>
  