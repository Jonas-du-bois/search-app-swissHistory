<template>
    <div class="search-results">
      <div class="results-header">
        <h2>Résultats de recherche</h2>
        <div class="query-info">
          <p>
            Recherche pour: <strong>{{ originalQuery }}</strong>
            <span v-if="originalQuery !== translatedQuery">
              (traduit en: <strong>{{ translatedQuery }}</strong>)
            </span>
          </p>
          <p>{{ results.length }} résultat(s) trouvé(s)</p>
        </div>
      </div>
      
      <div class="results-list">
        <div v-for="(result, index) in results" :key="index" class="result-item">
          <h3 v-if="result.title_eng || result.title">
            {{ result.title || result.title_eng }}
          </h3>
          <p v-if="result.description_eng || result.description" class="description">
            {{ result.description || result.description_eng }}
          </p>
          <div class="meta-info">
            <span v-if="result.origin_language" class="language-tag">
              Langue: {{ result.origin_language }}
            </span>
            <span v-if="result._id" class="id-tag">
              ID: {{ result._id }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'SearchResults',
    props: {
      results: {
        type: Array,
        required: true
      },
      originalQuery: {
        type: String,
        required: true
      },
      translatedQuery: {
        type: String,
        required: true
      }
    }
  };
  </script>
  
  <style scoped>
  .search-results {
    background-color: #f9f9f9;
    border-radius: 8px;
    padding: 20px;
  }
  
  .results-header {
    margin-bottom: 20px;
    padding-bottom: 15px;
    border-bottom: 1px solid #eee;
  }
  
  .query-info {
    color: #555;
    font-size: 14px;
  }
  
  .results-list {
    display: grid;
    gap: 20px;
  }
  
  .result-item {
    background-color: white;
    border-radius: 6px;
    padding: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    transition: transform 0.2s, box-shadow 0.2s;
  }
  
  .result-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  .result-item h3 {
    margin-top: 0;
    color: #1a73e8;
  }
  
  .description {
    color: #333;
    line-height: 1.6;
  }
  
  .meta-info {
    margin-top: 15px;
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }
  
  .language-tag, .id-tag {
    display: inline-block;
    padding: 3px 8px;
    border-radius: 12px;
    font-size: 12px;
    background-color: #e8f0fe;
    color: #1967d2;
  }
  </style>
  