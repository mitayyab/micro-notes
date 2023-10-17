export type Link = {
   label: string;
   route: string;
};

export const links: Link[] = [
   { label: 'Home', route: '/' },
   { label: 'Notes', route: '/notes' },
   { label: 'Quizzes', route: '/quizzes' },
];
