<template>
	<div class="card">
		<img
			:src="character.image"
			:alt="character.name"
		>
		<div>
			<h3>{{ character.name }}</h3>
			<p><span class="semi-bold">Last known location: <br></span>{{ character.location.name }}</p>
			<p><span class="semi-bold">First seen in: <br></span>{{ firstSeen }}</p>
			<p class="status">
				<span class="semi-bold" /><span class="status__icon" />{{ character.status }} - {{ character.species }}
			</p>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { Character } from '../types/types';

interface Props {
	character: Character;
}
//Передача параметра в карточку
const props = defineProps<Props>();
const firstSeen = ref<string | null>(null);
const error = ref<string | null>(null);
const colorStatusIcon = ref<string | null>(null);

setStatusColor(props.character.status);
//Функция для получения name эпизода в котором персонаж появился впервые
async function fetchData(): Promise<void> {
	try {
		await fetch(`${props.character?.episode[0]}`)
			.then(response => response.json())
			.then(data => {
				firstSeen.value = data.name;
			});
	}
	catch (err) {
		error.value = (err as Error).toString();
	}
}

//Функция установки цвета статуса
function setStatusColor(character_status: string){
	switch (character_status.toLowerCase()) {
			case 'alive':
					colorStatusIcon.value='green';
					break;
			case 'dead':
					colorStatusIcon.value='red';
					break;
			case 'unknown':
					colorStatusIcon.value='gray';
					break;
			default:
					break;
	}
}

onMounted(() => {
	fetchData();
});
</script>

<style scoped>
.card {
	background-color: hsl(0, 0%, 100%);
	border-radius: 5px;
	width: 300px;

	box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.2);
}

img {
	width: 300px;
	height: 300px;
}

.card div {
	padding-left: 20px;
}

h3 {
	font-weight: 800;
	font-size: 18px;
	margin-bottom: 20px;
	margin-top: 20px;
}

p {
	font-size: 14px;
	color: hsl(200, 15%, 8%);
	margin: 8px 0 8px 0;
}

.semi-bold {
	font-weight: 600;
}

.status__icon{
	height: 0.5rem;
	width: 0.5rem;
	margin-right: 0.375rem;
	background: v-bind(colorStatusIcon);
	border-radius: 50%;
}
.status{
	display: flex;
	align-items: center;

}

</style>
