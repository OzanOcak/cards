import { TextInput, View } from "@/components/themed"
import {
	useEditWord,
	useEditWordActions,
	useWords,
} from "@/hooks/use-word-store"
import { Stack, useLocalSearchParams, useRouter } from "expo-router"
import { StatusBar } from "expo-status-bar"
import { Platform, Pressable, Text } from "react-native"

export default function EditNote() {
	const { id } = useLocalSearchParams<{ id: string }>()
	const { title, definition, sentence, level, inGame } = useEditWord()
	const {
		onChangeTitle,
		onChangeDefinition,
		onChangeSentence,
		onChangeLevel,
		onChangeInGame,
		saveWord,
		deleteWord,
	} = useEditWordActions()
	const router = useRouter()

	const words = useWords()
	const word = words.find((word) => word.id === Number(id))

	const isEditing = id !== undefined
	const isiOS = Platform.OS === "ios"
	const isAndroid = Platform.OS === "android"

	const DeleteButton = (
		<Pressable
			onPress={() => {
				deleteWord(id)
				router.back()
			}}
			className="active:opacity-50"
		>
			<Text className="text-lg font-medium text-red-600 dark:text-red-400">
				Delete
			</Text>
		</Pressable>
	)

	const SaveButton = (
		<View className="flex flex-row gap-x-8">
			{isEditing && isAndroid && DeleteButton}
			<Pressable
				onPress={() => {
					saveWord(id)
					router.back()
				}}
				className="active:opacity-50"
			>
				<Text className="text-lg font-medium text-blue-600 dark:text-blue-400">
					Save
				</Text>
			</Pressable>
		</View>
	)

	return (
		<View className="m-4 gap-y-4">
			<Stack.Screen
				options={{
					title: id ? "Edit note" : "New note",
					headerLeft: () => isEditing && isiOS && DeleteButton,
					headerRight: () => SaveButton,
				}}
			/>
			<TextInput
				defaultValue={word?.title ?? ""}
				value={title}
				onChangeText={onChangeTitle}
				placeholder="Title"
				className="text-2xl font-semibold"
			/>
			<TextInput
				multiline
				defaultValue={word?.definition ?? ""}
				value={definition}
				onChangeText={onChangeDefinition}
				placeholder="Definition"
				className=" align-top"
			/>
			<TextInput
				defaultValue={word?.sentence ?? ""}
				value={sentence}
				onChangeText={onChangeSentence}
				placeholder="Sentence"
				className="text-2xl font-semibold"
			/>
			<TextInput
				defaultValue={word?.level ?? ""}
				value={level}
				onChangeText={onChangeTitle}
				placeholder="level"
				className="text-2xl font-semibold"
			/>

			{/* Use a light status bar on iOS to account for the black space above the modal */}
			<StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
		</View>
	)
}
