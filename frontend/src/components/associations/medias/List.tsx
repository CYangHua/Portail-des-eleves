import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { api } from "../../../services/apiService";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import { Col } from "react-bootstrap";
import { PageTitle } from "../../utils/PageTitle";
import { Pagination } from "../../utils/Pagination";
import { TaggableModel, TagList } from "../../utils/tags/TagList";
import { AssociationLayout } from "../Layout";
import { TagSearch } from "../../utils/tags/TagSearch";

export const AssociationFilesystemList = ({ association }) => {
    const associationId = association.id;
    const history = useHistory();

    const [tagParams, setTagParams] = useState({});

    return (
        <AssociationLayout
            association={association}
            additionalSidebar={
                <TagSearch
                    tagsQueryParams={{
                        page_size: 1000,
                        namespace__scoped_to_model: "association",
                        namespace__scoped_to_pk: associationId,
                        related_to: "media",
                    }}
                    setTagParams={setTagParams}
                />
            }
        >
            <Pagination
                apiKey={["medias.list", associationId, tagParams]}
                apiMethod={api.medias.list}
                render={(medias, paginationControl) => (
                    <>
                        {association.myRole.mediaPermission && (
                            <Link
                                to={`/associations/${association.id}/fichiers/televerser`}
                                className={"btn btn-success float-right mt-5"}
                            >
                                <i className="fe fe-upload" />
                                Ajouter des fichiers
                            </Link>
                        )}
                        <PageTitle className={"mt-6"}>Fichiers</PageTitle>
                        <Row>
                            {medias.map((media) => {
                                return (
                                    <Col md={4} key={media.id}>
                                        <Card
                                            onClick={() =>
                                                history.push(
                                                    `/associations/${association.id}/fichiers/${media.id}/`
                                                )
                                            }
                                        >
                                            <Card.Body>
                                                <h4>{media.name}</h4>
                                                <p className="text-muted">
                                                    {media.description}
                                                </p>

                                                <TagList
                                                    model={TaggableModel.Media}
                                                    id={media.id}
                                                    collapsed={true}
                                                />
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                );
                            })}
                        </Row>
                        {paginationControl}
                    </>
                )}
            />
        </AssociationLayout>
    );
};