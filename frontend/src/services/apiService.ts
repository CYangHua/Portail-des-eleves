import Axios, { AxiosResponse } from "axios";
import applyConverters from "axios-case-converter";
import { Association } from "../models/associations/association";
import { Page } from "../models/associations/page";
import { Marketplace, Transaction } from "../models/associations/marketplace";
import { Media } from "../models/associations/media";
import { QueryResult, useQuery } from "react-query";
import { Ballot, Election, Result } from "../models/associations/election";
import { User } from "../models/user";
import { Course } from "../models/courses/course"
import { Form } from "../models/courses/form"
import { Question } from "../models/courses/question"
import { StatsQuestion } from "../models/courses/requests";


const baseApi = "http://localhost:8000/api/v1";

export enum electionActiveStatus {
    Past = 'PAST',
    Active = 'ACTIVE',
    Upcoming = 'UPCOMING'
}

export const apiService = applyConverters(
    Axios.create({
        withCredentials: true,
        baseURL: baseApi
    })
);

function unwrap<T>(promise) {
    return promise.then((response: AxiosResponse<T>) => {
        return response.data;
    });
}

export const api = {
    pages: {
        list: associationId =>
            unwrap<Page[]>(
                apiService.get(
                    `/associations/pages/?association=${associationId}&page_type=STATIC`
                )
            ),
        get: pageId =>
            unwrap<Page>(apiService.get(`/associations/pages/${pageId}`)),
        save: page => {
            if (!page.id) {
                return unwrap<Page>(
                    apiService.post(`/associations/pages/`, page)
                );
            }

            return unwrap<Page>(
                apiService.patch(`/associations/pages/${page.id}/`, page)
            );
        },
        delete: page => {
            return unwrap<Page>(
                apiService.delete(`/associations/pages/${page.id}/`)
            );
        }
    },
    news: {
        list: associationId =>
            unwrap<Page[]>(
                apiService.get(
                    `/associations/pages/?association=${associationId}&page_type=NEWS`
                )
            ),
        get: newsId =>
            unwrap<Page>(apiService.get(`/associations/pages/${newsId}`))
    },
    associations: {
        list: () =>
            unwrap<Association[]>(
                apiService.get(`/associations/associations/`)
            ),
        get: associationId =>
            unwrap<Association>(
                apiService.get(`/associations/associations/${associationId}`)
            )
    },
    medias: {
        list: associationId =>
            unwrap<Media[]>(
                apiService.get(
                    `/associations/media/?association=${associationId}`
                )
            ),
        get: fileId =>
            unwrap<Media>(apiService.get(`/associations/media/${fileId}`)),
        patch: file => {
            return unwrap<Media>(
                apiService.patch(`/associations/media/${file.id}/`, file, {
                    headers: { "Content-Type": "multipart/form-data" }
                })
            );
        },
        upload: (file, association, onUploadProgress) => {
            let formData = new FormData();
            formData.append("name", file.name);
            formData.append("file", file);
            formData.append("association", association.id);

            // We don't unwrap here because be need to access all of the axios
            // object in the render logic to display progress
            return apiService.post(`/associations/media/`, formData, {
                onUploadProgress: onUploadProgress
            });
        },
        delete: file => {
            return apiService.delete(`/associations/media/${file.id}`, {
                headers: { "Content-Type": "multipart/form-data" }
            });
        }
    },
    elections: {
        list: (associationId, activeStatus) =>
            unwrap<Election[]>(
                apiService.get(
                    `/associations/elections/?association=${associationId}&active_status=${activeStatus}`
                )
            ),
        get: electionId =>
            unwrap<Election>(apiService.get(`/associations/elections/${electionId}`)),
        results: electionId =>
            unwrap<Result>(
                apiService.get(`associations/elections/${electionId}/results`)
            ),
        vote: vote =>
            unwrap<Ballot>(
                apiService.post(`/associations/elections/${vote.election}/vote/`, vote)
            ),
        save: (election, edit, id) => {
            if (!edit) {
                return unwrap<Election>(
                    apiService.post(`/associations/elections/`, election)
                );
            }
            return (
                apiService.delete(`/associations/elections/${id}`, {
                    headers: { "Content-Type": "multipart/form-data" }
                })
                    .then(unwrap<Election>(apiService.post(`/associations/elections/`, election)))
            )

        },
        delete: election => {
            return apiService.delete(`/associations/elections/${election.id}`, {
                headers: { "Content-Type": "multipart/form-data" }
            });
        }
    },

    marketplace: {
        get: marketplaceId =>
            unwrap<Marketplace>(
                apiService.get(`/associations/marketplace/${marketplaceId}`)
            )
    },

    products: {
        list: associationId =>
            unwrap<Page[]>(
                apiService.get(
                    `/associations/products/?association=${associationId}`
                )
            )
    },

    transactions: {
        create: (product, quantity, buyer) =>
            apiService.post("/associations/transactions/", {
                product: product.id,
                quantity: quantity,
                buyer: buyer.id
            }),

        get: (marketplaceId, user: User) =>
            unwrap<Transaction[]>(
                apiService.get(`associations/transactions/?marketplace=${marketplaceId}&buyer=${user.id}`)
            )
    },


    courses: {
        list: () =>
            unwrap<Course[]>(
                apiService.get(
                    '/courses/courses'
                )
            ),
        get: courseId =>
            unwrap<Page>(
                apiService.get(
                    `/courses/courses/${courseId}`
                )
            ),
        save: course => {
            if (!course.id) {
                return unwrap<Page>(
                    apiService.post(`/courses/courses/`, course)
                );
            }
            return unwrap<Page>(
                apiService.patch(`/courses/courses/${course.id}/`, course)
            );
        },
        list_questions: courseId =>
            unwrap<Question[]>(
                apiService.get(
                    `/courses/courses/${courseId}/questions`
                )
            ),
        submit: (courseId, data) =>
            apiService.post(
                `/courses/courses/${courseId}/submit`,
                data,
            ),
        has_voted: (courseId) =>
            apiService.get(
                `/courses/courses/${courseId}/has_voted`,
            ).then(res => {
                return res.data.hasVoted;
            }),
        stats: (courseId) =>
            unwrap<StatsQuestion[]>(
                apiService.get(
                    `/courses/courses/${courseId}/stats`
                )
            ),
        forms: {
            get: (id: number) => {
                unwrap<Form>(
                    apiService.get(
                        `/courses/forms/${id}`
                    )
                )
            },
            list: () =>
                unwrap<Form[]>(
                    apiService.get(
                        `/courses/forms`
                    )
                ),
            create: (name: string) =>
                unwrap<Form>(
                    apiService.post(
                        `courses/forms/`,
                        { "name": name },
                    )
                ),
            questions: {
                save: (question: Question) => {
                    console.log("Begore " + question.form)
                    if (! question.id) {
                        return unwrap<Question>(
                            apiService.post(`/courses/questions/`, question)
                        );
                    }

                    return unwrap<Question>(
                        apiService.patch(`/courses/questions/${question.id}/`, question)
                    );
                },
                list: (id: number) =>
                    unwrap<Question[]>(
                        apiService.get(
                            `courses/forms/${id}/questions`,
                        )
                    ),
            }
        },
    },
};

export function useBetterQuery<T>(
    key: string,
    fetchFunction: any,
    ...params: any[]
): QueryResult<T> {
    return useQuery<T, string, any>(key, params, (key, ...params) =>
        fetchFunction(...params)
    );
}
