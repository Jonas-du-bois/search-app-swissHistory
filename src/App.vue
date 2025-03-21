<template>
  <div class="container mx-auto p-4">
    <h1 class="text-3xl font-bold mb-6">Application de Recherche</h1>
    
    <!-- Barre de recherche -->
    <div class="mb-6">
      <input 
        type="text" 
        v-model="searchQuery"
        @keyup.enter="search"
        placeholder="Entrez votre recherche en français et appuyez sur Enter..."
        class="w-full p-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

    <!-- Affichage de la traduction -->
    <div v-if="translatedQuery" class="mb-4 text-sm text-gray-600">
      Recherche en anglais : "{{ translatedQuery }}"
    </div>

    <!-- Message d'erreur de traduction -->
    <div v-if="translationError" class="mb-4 text-sm text-red-500">
      Erreur de traduction : {{ translationError }}
    </div>

    <!-- Résultats de la recherche -->
    <div v-if="isLoading" class="text-center py-8">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
    </div>

    <div v-else-if="error" class="text-red-500">
      {{ error }}
    </div>

    <div v-else>
      <p class="mb-6 text-gray-600" v-if="totalResults">{{ totalResults }} résultats trouvés</p>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="result in results" 
          :key="result.document_url"
          class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
        >
          <!-- Image -->
          <div class="aspect-w-16 aspect-h-9 bg-gray-100">
            <img 
              v-if="result.thumbnail_url" 
              :src="result.thumbnail_url" 
              :alt="result.title"
              class="object-cover w-full h-full"
            />
            <div v-else class="flex items-center justify-center h-full bg-gray-200">
              <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>

          <!-- Contenu -->
          <div class="p-4">
            <h3 class="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
              {{ result.title }}
            </h3>
            <p class="text-gray-600 text-sm mb-4 line-clamp-3">
              {{ result.description }}
            </p>
            <a 
              :href="result.document_url" 
              target="_blank"
              class="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Voir le document
              <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      <!-- Message si aucun résultat -->
      <div v-if="!isLoading && results.length === 0" class="text-center py-8">
        <p class="text-gray-500">Aucun résultat trouvé</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { searchDatabase } from './services/databaseService';
import { translateText } from './services/translationService';

export default {
  name: 'App',
  setup() {
    const searchQuery = ref('');
    const results = ref([]);
    const isLoading = ref(false);
    const error = ref(null);
    const translatedQuery = ref(null);
    const translationError = ref(null);
    const totalResults = ref(0);

    const search = async () => {
      if (!searchQuery.value.trim()) return;
      
      isLoading.value = true;
      error.value = null;
      translatedQuery.value = null;
      translationError.value = null;

      try {
        // 1. Obtenir la traduction
        console.log('🔄 Début de la traduction...');
        translatedQuery.value = await translateText(searchQuery.value);
        console.log('✅ Traduction reçue:', translatedQuery.value);

        // 2. Lancer la recherche avec la traduction
        console.log('🔄 Début de la recherche avec la traduction...');
        const searchData = await searchDatabase(searchQuery.value, translatedQuery.value);
        
        // Dédupliquer les résultats basé sur document_url
        const uniqueResults = searchData.results.reduce((acc, current) => {
          const exists = acc.find(item => item.document_url === current.document_url);
          if (!exists) {
            acc.push(current);
          }
          return acc;
        }, []);

        results.value = uniqueResults;
        totalResults.value = uniqueResults.length;
      } catch (error) {
        console.error('❌ Erreur:', error);
        error.value = error.message;
        translationError.value = error.message;
      } finally {
        isLoading.value = false;
      }
    };

    return {
      searchQuery,
      results,
      isLoading,
      error,
      translatedQuery,
      translationError,
      totalResults,
      search
    };
  }
};
</script>

<style>
/* Ajoutez vos styles CSS ici si nécessaire */
</style>