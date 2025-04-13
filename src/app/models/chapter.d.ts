type Topic = {
    id: string;
    name: string;
    svgString: string;
    link: string;
};

type Chapter = {
    id: string;
    name: string;
    description?: string;
    topics: Topic[];
};
