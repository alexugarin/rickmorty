<template>
	<div class="bg-gray-50 rounded-md w-72 shadow-md">
		<img
			class="w-72 h-72 rounded-t-md"
			:src="character.image"
			:alt="character.name"
		>
		<div class="pl-5">
			<h3 class="mt-3">
				{{ character.name }}
			</h3>
			<p><span class="font-semibold">Last known location: <br></span>{{ character.location.name }}</p>
			<p><span class="font-semibold">First seen in: <br></span>{{ firstSeen }}</p>
			<p class="flex items-center">
				<span class="font-semibold" /><span class="status__icon" />{{ character.status }} - {{ character.species }}
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
p {
	font-size: 14px;
	color: hsl(200, 15%, 8%);
	margin: 8px 0 8px 0;
}

.status__icon{
	height: 0.5rem;
	width: 0.5rem;
	margin-right: 0.375rem;
	background: v-bind(colorStatusIcon);
	border-radius: 50%;
}
</style>
