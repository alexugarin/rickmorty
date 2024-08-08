<template>
	<div>
		<div class="header">
			<h1>Rick and Morty | Characters</h1>
			<pagination
				:prev="prev"
				:next="next"
				:selected-page="selectedPage"
				:pages="pages"
			/>
			<div class="filter">
				<div>
					<select
						id="status"
						v-model="status"
						name="status"
					>
						<option
							selected
							disabled
							value="null"
						>
							Select status
						</option>
						<option value="alive">
							alive
						</option>
						<option value="dead">
							dead
						</option>
						<option value="unknown">
							unknown
						</option>
					</select>
					<input
						id="name"
						v-model="name"
						type="text"
						placeholder="name..."
					>
				</div>
				<div>
					<button @click="goToFilter">
						Применить
					</button>
					<button @click="dropFilter">
						Сбросить
					</button>
				</div>
			</div>
		</div>
		<div
			v-if="loading"
			class="loader"
		/>
		<div
			v-if="error"
			class="error"
		>
			Not Found
		</div>
		<div
			v-if="characters && !loading"
			class="container"
		>
			<card
				v-for="character in characters"
				:key="character.id"
				:character="character"
			/>
		</div>
	</div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Card from '../components/CardComponent.vue';
import Pagination from '../components/PaginationItem.vue';
import { Info, Character } from '../types/types.ts';

const route = useRoute();     //Текущий роут
const router = useRouter();

const characters = ref<Character[] | null>(null);  //Объект с персонажами на странице
const info = ref<Info | null>(null);        //Информация о количестве страниц, ссылками на следующую страницу
const pages = ref<number | null>(null);       //Количество страниц
const prev = ref<string | null>(null);        //Предыдущая страница
const next = ref<string | null>(null);        //Следующая страница
const selectedPage = ref<number>(1);   //Текущая страница
const loading = ref<boolean>(false);    //Флаг для лоадера
const error = ref<string | null>(null);       //Поле для ошибки
const name = ref<string | null>(null);        //Переменна для параметра name для фильтрации
const status = ref<string | null>(null);      //Переменна для параметра status для фильтрации

//Сброс фильтров
function dropFilter(){
  status.value = null;
  name.value = null;
  router.push({name: 'Characters', query: { page: 1 }});
}

//Смена станицы если используем фильтр кнопкой "применить"
function goToFilter(): void {
  const query: Record<string, string> = {}; //Заводим объект под параметры для фильтрации
  if (name.value != null && name.value != undefined) {
    query.name = name.value;
  }
  if (status.value != null && status.value != undefined) {
    query.status = status.value;
  }
  //Проверяем существующие фильтры
  if (Object.keys(query).length != 0) {
    // Объект не пуст, используем запрос с фильтрами
    router.push({ name: 'Characters', query: { ...query, page: 1 } });
  }
  else {
    //Объект пуст, очищаем фильтр
    router.push({ name: 'Characters', query: { page: 1 } });
  }
}
//Асинхронная функция для отправки запроса
async function fetchData(path: Record<string, string>): Promise<void> {
  //Объект с параметрами из роута
  const paramsObj = path;
  const searchParams = new URLSearchParams(paramsObj);
  //Флаг для заглушки загрузки
  loading.value = true;
  error.value = '';
  try {
    await fetch(`https://rickandmortyapi.com/api/character?${searchParams.toString()}`)
      .then(response => response.json())
      .then(data => {
        characters.value = data.results;
        info.value = data.info;
        pages.value = info.value.pages;
        prev.value = data.info.prev;
        next.value = data.info.next;
        selectedPage.value = Number(path.page) || 1;
      });
  }
  catch (err) {
    error.value = (err as Error).toString();
  }
  finally {
    loading.value = false;
  }
}
//В случае изменение роута,
watch(
  () => route.query,
  () => {
    fetchData(route.query as Record<string, string>);
  }
);

onMounted(async () => {
  fetchData(route.query as Record<string, string>);
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
