import { Router } from "express";
import passport from "passport";
import { loginController, googleLoginController, googleStartController,
  googleCallbackController,} from "./login.controller";
import { createPortalOAuthState } from "./portal-oauth-states";

const router = Router();

router.post("/login", loginController);
router.post("/google", googleLoginController);

router.get("/google/start", googleStartController);

// Portal customer login — state contiene un token CSRF + slug encapsulado server-side
router.get("/portal/:slug/google", (req, res, next) => {
  const token = createPortalOAuthState(req.params["slug"]);
  const state = "portal:" + token;
  passport.authenticate("google", { scope: ["profile", "email"], session: false, state } as any)(req, res, next);
});

// Portal logout
router.get("/portal/logout", (req, res) => {
  res.clearCookie("portal_session");
  const slug = (req.query["slug"] as string) || "";
  return res.redirect(slug ? "/shop/" + encodeURIComponent(slug) : "/");
});

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/auth/google/failure",
  }),
  googleCallbackController
);

router.get("/google/failure", (_, res) => {
  return res.status(401).send("Error iniciando sesión con Google");
})

router.get("/logout", (_req, res) => {
  return res.redirect(
    "https://accounts.google.com/logout"
  );
});

export default router;