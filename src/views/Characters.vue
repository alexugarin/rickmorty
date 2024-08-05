<template>
  <div>
    <div class="header">
      <h1>Rick and Morty | Characters</h1>
      <Pagination :prev="prev" :next="next" :selectedPage="selectedPage" :pages="pages"/>
      <div class="filter">
        <div>
          <select v-model="status" name="status" id="status">
          <option selected disabled value="null">Select status</option>
          <option value="alive">alive</option>
          <option value="dead">dead</option>
          <option value="unknown">unknown</option>
        </select>
        <input v-model="name" id="name" type="text" placeholder="name...">
        </div>
        <div>
          <button @click="goToFilter">Применить</button>
          <button @click="dropFilter">Сбросить</button>
        </div>
      </div>
    </div>
    <div v-if="loading" class="loader"></div>
    <div v-if="error" class="error">Not Found</div>
    <div class='container' v-if="characters && !loading">
      <Card :key="character.id" v-for="character in characters" :character="character" />
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Card from '../components/Card.vue';
import Pagination from '../components/Pagination.vue';

const route = useRoute();     //Текущий роут
const router = useRouter();
const characters = ref(null)  //Объект с персонажами на странице
const info = ref(null)        //Информация о количестве страниц, ссылками на следующую страницу
const pages = ref(null)       //Количество страниц
const prev = ref(null)        //Предыдущая страница
const next = ref(null)        //Следующая страница
const selectedPage = ref(1)   //Текущая страница
const loading = ref(false)    //Флаг для лоадера
const error = ref(null)       //Поле для ошибки
const name = ref(null)        //Переменна для параметра name для фильтрации
const status = ref(null)      //Переменна для параметра status для фильтрации

//Сброс фильтров 
function dropFilter(){
  status.value = null;
  name.value = null;
  router.push({name: 'Characters', query: { page: 1 }})
}

//Смена станицы если используем фильтр кнопкой "применить"
function goToFilter() {
  const query = {} //Заводим объект под параметры для фильтрации
  if (name.value != null && name.value != undefined) {
    query.name = name.value
  }
  if (status.value != null && status.value != undefined) {
    query.status = status.value
  }
  //Проверяем существующие фильтры
  if (Object.keys(query).length != 0) {
    // Объект не пуст, используем запрос с фильтрами
    router.push({ name: 'Characters', query: { ...query, page: 1 } })
  }
  else {
    //Объект пуст, очищаем фильтр
    router.push({ name: 'Characters', query: { page: 1 } })
  }
}
//Асинхронная функция для отправки запроса
async function fetchData(path) {
  //Объект с параметрами из роута
  const paramsObj = path;
  const searchParams = new URLSearchParams(paramsObj);
  //Флаг для заглушки загрузки
  loading.value = true;
  error.value = false;
  try {
    await fetch(`https://rickandmortyapi.com/api/character?${searchParams.toString()}`)
      .then(response => response.json())
      .then(data => {
        characters.value = data.results
        info.value = data.info
        pages.value = info.value.pages
        prev.value = data.info.prev
        next.value = data.info.next
        selectedPage.value = path.page
      });
  }
  catch (err) {
    error.value = err.toString();
  }
  finally {
    loading.value = false
  }
}
//В случае изменение роута, 
watch(
  () => route.query,
  (newPage, oldPage) => {
    fetchData(route.query)
  }
);

onMounted(async () => {
  fetchData(route.query);
});
</script>

<style scoped>
.container {
  width: 95%;
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  flex-direction: row;
  justify-content: space-between;
  margin: 0 auto 0 auto;
}

.loader {
  font-weight: bold;
  font-family: sans-serif;
  font-size: 30px;
  animation: l1 1s linear infinite alternate;
  display: flex;
  justify-content: center;
}

.loader:before {
  content: "Loading..."
}

@keyframes l1 {
  to {
    opacity: 0
  }
}

.header {
  display: flex;
  gap: 30px;
  @media screen and (max-width: 450px) {
    flex-direction: column;
    gap: 5px;
  }
}

.control-page {
  display: flex;
  align-items: center;
}

.filter {
  display: flex;
  align-items: center;
  gap: 10px;
  @media screen and (max-width: 450px) {
    flex-direction: column;
    gap: 5px;
    align-items:flex-start;
    padding-left:20px;
  }
}

.filter div{
  display: flex;
  gap: 10px;
  align-items: center;
}

.error {
  font-weight: bold;
  font-family: sans-serif;
  font-size: 30px;
  display: flex;
  justify-content: center;
}

h1{
  margin-left:30px;
}
</style>