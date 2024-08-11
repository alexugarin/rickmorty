<template>
	<div>
		<div class="my-4 flex flex-col gap-1 md:flex-col sm:gap-4 mr-auto ml-auto md:w-11/12">
			<h1>
				Rick and Morty | Characters
			</h1>
			<div class="my-4 flex flex-col gap-1 md:flex-row sm:gap-8 md:justify-between">
				<div class="flex lg:flex-row lg:gap-5 sm:items-start lg:items-center flex-col gap-1 items-start">
					<div class="flex gap-3 items-center">
						<select
							id="status"
							v-model="status"
							class="block w-full p-1 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
							name="status"
						>
							<option
								selected
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
							class="block w-full p-1 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
							type="text"
							placeholder="name..."
						>
					</div>
					<div class="gap-2">
						<button
							class="btn btn-green"
							@click="goToFilter"
						>
							Применить
						</button>
						<button
							class="btn btn-yellow"
							@click="dropFilter"
						>
							Сбросить
						</button>
					</div>
				</div>
				<pagination
					:prev="prev"
					:next="next"
					:selected-page="selectedPage"
					:pages="pages"
				/>
			</div>
		</div>
		<div
			v-if="loading"
			class="loader"
		/>
		<div
			v-if="error"
			class="font-sans text-3xl flex justify-center"
		>
			Not Found
		</div>
		<div
			v-if="characters && !loading"
			class="w-11/12 flex flex-row flex-wrap gap-5 justify-between mb-5 ml-auto mr-auto"
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
const pages = ref<number>(1);       //Количество страниц
const prev = ref<string | null>(null);        //Предыдущая страница
const next = ref<string | null>(null);        //Следующая страница
const selectedPage = ref<number>(1);   //Текущая страница
const loading = ref<boolean>(false);    //Флаг для лоадера
const error = ref<string | null>(null);       //Поле для ошибки
const name = ref<string | null>(null);        //Переменная для параметра name для фильтрации
const status = ref<string | null>(null);      //Переменная для параметра status для фильтрации

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
	if (
		status.value != null &&
		status.value != undefined &&
		status.value != 'null'
	){
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
        pages.value = data.info.pages;
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
</style>
