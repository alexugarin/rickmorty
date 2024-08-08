<template>
	<div class="control-page">
		<button
			v-if="prev"
			@click="goTo(prev)"
		>
			Prev
		</button>
		<ul @click="goToSelectedPage($event)">
			<li
				v-for="page in pagesButtonArr"
				:key="pagesButtonArr.indexOf(page)"
				:class="{ selected:selectedPage==page }"
			>
				{{ page }}
			</li>
		</ul>
		<button
			v-if="next"
			@click="goTo(next)"
		>
			Next
		</button>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';

interface PaginationProps {
  prev: string | null;
  next: string | null;
  selectedPage: number;
  pages: number | null;
}

const props = defineProps<PaginationProps>();
const router = useRouter();
const route = useRoute();

const pagesButtonArr = computed(() => {
	const selected_window = [
		+props.selectedPage - 2,
		+props.selectedPage - 1,
		+props.selectedPage,
		+props.selectedPage + 1,
		+props.selectedPage + 2
	];

	const result = [];

	try {
			if (props.pages > 4) {
					if (props.selectedPage < props.pages - 2 && props.selectedPage > 4)
							result.push(1, '...', ...selected_window, '...', +props.pages);
					else if (props.selectedPage <= 4){
							if (props.pages<=6)
									result.push(1, 2, 3, 4, 5, 6);
							else
									result.push(1, 2, 3, 4, 5, '...', +props.pages);
					}
					else if (props.selectedPage >= props.pages - 2)
							result.push(1, '...', props.pages - 3, props.pages - 2, props.pages - 1, props.pages);
					else {
							throw new Error('Ошибка компонента пагинации!');
					}
			}
			else {
					for(let i=1;i<= +props.pages;i++){
							result.push(i);
					}
			}
	}
	catch (e){
			console.error(e);
	}
return result;
});

//Функция слушатель для перехода по пагинации по кнопкам
function goTo(path: string) {
const url = new URL(path);
router.push({ name: 'Characters', query: { ...route.query, page: url.searchParams.get('page') } });
}

// Функция слушатель для перехода по пагинации
function goToSelectedPage(event: MouseEvent) {
	const target = event.target as HTMLElement;
  const pageNumber = parseInt(target.innerHTML);
  if (!isNaN(pageNumber)) {
    router.push({ name: 'Characters', query: { ...route.query, page: pageNumber.toString() } });
  }
}
</script>

<style scoped>
ul, li {
	user-select: none;
}
ul{
	list-style-type:none;
	display:flex;
	gap:5px;
	padding-inline-start: 0;
}
li{
	cursor: pointer;
}
.selected{
	font-weight: bold;
}
button{
	margin-inline: 20px;
}
</style>
