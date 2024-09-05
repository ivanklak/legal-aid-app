import {ISuggestionData} from "../../api/requests/GetOrganisationSuggestionsRequest";

export interface IPartner {
    id: string;
    data: ISuggestionData;
    value: string;
}

export const partners: IPartner[] = [
    {
        id: 's6er-p4r1n3r-1d',
        value: 'ПАО СБЕРБАНК',
        data: {
            name: 'ПАО СБЕРБАНК',
            address: {
                value: 'г Москва, ул Вавилова, д 19',
                unrestricted_value: '117312, г Москва, Академический р-н, ул Вавилова, д 19',
                data: {
                    postal_code: '117312'
                }
            },
            inn: '7707083893',
            kpp: '773601001',
            ogrn: '1027700132195'
        }
    },
    {
        id: 'y4nd3x-p4r1n3r-1d',
        value: 'ООО "ЯНДЕКС.МАРКЕТ"',
        data: {
            name: 'ООО "ЯНДЕКС.МАРКЕТ"',
            address: {
                value: 'г Москва, ул Садовническая, д 82 стр 2, помещ 2А',
                unrestricted_value: '115035, г Москва, р-н Замоскворечье, ул Садовническая, д 82 стр 2, помещ 2А',
                data: {
                    postal_code: '115035'
                }
            },
            inn: '7704357909',
            kpp: '770401001',
            ogrn: '1167746491395'
        }
    },
    {
        id: 's4m0k4t-p4r1n3r-1d',
        value: 'ООО "УМНЫЙ РИТЕЙЛ"',
        data: {
            name: 'ООО "УМНЫЙ РИТЕЙЛ"',
            secondName: 'Самокат',
            address: {
                value: 'г Москва, ул Барклая, д 6 стр 3, помещ 8Н',
                unrestricted_value: '121087, г Москва, р-н Филевский парк, ул Барклая, д 6 стр 3, помещ 8Н',
                data: {
                    postal_code: '121087'
                }
            },
            inn: '7811657720',
            kpp: '773001001',
            ogrn: '1177847261602'
        }
    }
];