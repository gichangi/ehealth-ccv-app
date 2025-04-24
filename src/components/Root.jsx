import i18n from "@dhis2/d2-i18n";
import { CssVariables, CssReset, Menu, MenuItem } from "@dhis2/ui";
import { Fragment, useEffect } from "react";
import { Outlet, useResolvedPath, useNavigate } from "react-router-dom";
import useAppSettings from "../hooks/useAppSettings.js";
import CheckOrgUnitTree from "./check/OrgUnitTree.jsx";
import OrgUnitTree from "./explore/OrgUnitTree.jsx";
import styles from "./styles/Root.module.css";

export const appPages = [
    { path: "/", name: i18n.t("Home") },
    { path: "/dashboards", name: i18n.t("Dashboards") },
];

export const assessmentsList = [
    {
        path: "/assessments/A294977888e",
        name: i18n.t("Flood Health Facility Assessment"),
    },
    {
        path: "/assessments/A29497788qa",
        name: i18n.t("Heat Wave Facility Assessment"),
    },
];

const Root = () => {
    const { settings } = useAppSettings();
    const { pathname } = useResolvedPath();
    const navigate = useNavigate();

    useEffect(() => {
        if (pathname === "/" && settings?.startPage) {
            navigate(settings.startPage);
        }
    }, [settings, pathname, navigate]);

    return (
        <>

            <CssReset />
            <CssVariables spacers colors />
            <div className={styles.container}>
                <div className={styles.sidebar}>
                    <Menu>
                        {appPages.map(({ path, name }) => (
                            <Fragment key={path}>
                                <MenuItem
                                    label={name}
                                    href={`#${path}`}
                                    active={
                                        pathname === path ||
                                        (path !== "/" && pathname.startsWith(path))
                                    }
                                />
                                {path === "/explore" && pathname.startsWith("/explore") && (
                                    <OrgUnitTree />
                                )}
                            </Fragment>
                        ))}

                        <Fragment key={"assessments-menu-items"}>
                            <MenuItem
                                label={i18n.t("Assessments")}
                                href={`#/assessments`}
                                active={
                                    pathname === "/assessments" ||
                                    pathname.startsWith("/assessments")
                                }
                            />
                            {pathname.startsWith("/assessments") && (
                                <>
                                    {assessmentsList.map(({ path, name }) => (
                                        <>
                                            <MenuItem
                                                key={path}
                                                label={name}
                                                href={`#${path}`}
                                                active={pathname === path}
                                                className={styles.customSubMenuItem}
                                            />
                                            {pathname.startsWith(path) && (
                                                <OrgUnitTree pathPrefix={path} />
                                            )}
                                        </>
                                    ))}
                                </>
                            )}
                        </Fragment>


                        <Fragment key={'settings-route'}>
                            <MenuItem
                                label={'Settings'}
                                href={`#/settings`}
                                active={
                                    pathname === '/settings' ||
                                    ('/settings' !== "/" && pathname.startsWith('/settings'))
                                }
                            />
                        </Fragment>

                    </Menu>
                </div>
                <main className={styles.content}>
                    <Outlet />
                </main>
            </div>
        </>
    );
};

export default Root;
