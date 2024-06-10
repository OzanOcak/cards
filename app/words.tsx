import { Text, View } from "@/components/themed"
import {
	useRouteActions,
	useSearchText,
	useWordActions,
	useWords,
} from "@/hooks/use-word-store"
import { formatDistanceToNowStrict } from "date-fns"
import { Link, useLocalSearchParams } from "expo-router"
import { useEffect } from "react"
import { FlatList, Pressable } from "react-native"

function formatDate(date: string) {
	return `${formatDistanceToNowStrict(date)} ago`
}

export default function Index() {
	const params = useLocalSearchParams()

	const lang = params.l
	const cat = params.c

	const words = useWords()
	const searchText = useSearchText()
	const { refetch } = useWordActions()

	const { onSetCat, onSetLang } = useRouteActions()

	useEffect(() => {
		console.log(lang, cat)
		onSetCat(Number(cat))
		onSetLang(Number(lang))
	}, [])

	const filteredWords = words.filter((word) =>
		word.title?.toLowerCase().includes(searchText.toLowerCase()),
	)

	if (words.length === 0)
		return (
			<View className="flex-1 items-center justify-center">
				<Text className="animate-spin p-4 text-8xl">⓿</Text>
				<Text>Nothing yet</Text>
			</View>
		)

	return (
		<FlatList
			numColumns={2}
			data={filteredWords}
			refreshing={false}
			onRefresh={refetch}
			keyExtractor={(word) => String(word.id)}
			contentInsetAdjustmentBehavior="automatic"
			renderItem={({ item: word }) => (
				<Link
					asChild
					href={{
						pathname: "/edit",
						params: { id: word.id },
					}}
				>
					<Pressable className="flex-1 gap-y-2 rounded border border-black/75 p-4 dark:border-white/75">
						<Text className="line-clamp-1 text-2xl font-medium">
							{word.title}
						</Text>
						<Text className="line-clamp-4 flex-1">{word.definition}</Text>
						<Text className="line-clamp-4 flex-1">{word.sentence}</Text>
						<Text className="line-clamp-1 text-sm text-black/75 dark:text-white/75">
							{word.createdAt
								? `Edited: ${formatDate(word.createdAt)}`
								: formatDate(word.createdAt)}
						</Text>
					</Pressable>
				</Link>
			)}
			contentContainerStyle={{ gap: 8, padding: 8 }}
			columnWrapperStyle={{ gap: 8 }}
		/>
	)
}
