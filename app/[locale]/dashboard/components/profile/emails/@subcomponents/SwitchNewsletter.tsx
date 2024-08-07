"use client";
import { toaster } from "@/src/components/ui/@blitzinit/toaster/ToastConfig";
import { SwitchWrapper } from "@/src/components/ui/@blitzinit/user-interface/ui/SwitchWrapper";
import { updateUser } from "@/src/helpers/db/users.action";
import {
  createAudience,
  getAudienceByName,
} from "@/src/helpers/emails/audience";
import {
  createContact,
  deleteContact,
  getContactByUserEmail,
} from "@/src/helpers/emails/contact";
import { chosenSecret } from "@/src/helpers/functions/verifySecretRequest";
import { iUsers } from "@/src/types/db/iUsers";
import { ResendContact } from "@prisma/client";
import { Newspaper } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

type SwitchNewsletterProps = {
  user: iUsers;
};
export default function SwitchNewsletter({ user }: SwitchNewsletterProps) {
  const t = useTranslations("Dashboard.Components.Profile.Emails.SwitchNewsletter");
  const [activeNewsletter, setActiveNewsletter] = useState<boolean>(false);
  useEffect(() => {
    if (user.id) {
      setActiveNewsletter(user.isNewsletterSub ?? false);
    }
  }, [user]);

  const handleChangeActiveNewsletter = async (e: any) => {
    if (user.id) {
      const dataToSet = await updateUser({
        data: { email: user.email ?? "", isNewsletterSub: e },
        secret: chosenSecret(),
      });
      // We get audience by name
      if (dataToSet) {
        if (e === true) {
          // we get audience
          const audience = await getAudienceByName("Newsletter");
          if (!audience.data) {
            const newNewsletterAudience = await createAudience({
              name: "Newsletter",
            });
            if (
              newNewsletterAudience.success &&
              newNewsletterAudience.data &&
              user.email
            ) {
              await createContact({
                email: user.email,
                audienceId: newNewsletterAudience.data.id,
                first_name: user.name ?? user.email.split("@")[0],
              });
            }
          } else {
            await createContact({
              email: user.email ?? "",
              audienceId: audience.data.id,
              first_name: user.name ?? user.email?.split("@")[0] ?? "",
            });
          }
        } else {
          // We get the audience by name
          const audience = await getAudienceByName("Newsletter");
          if (!audience.data) throw new Error("Audience not found");
          const audienceId = audience.data.id;
          // We get the contact by his email and audience id via getContactByUserEmail
          const contact = await getContactByUserEmail(
            user.email ?? "",
            audienceId
          );
          if (!contact.data) {
            toaster({
              type: "error",
              description: t("toasters.error-get-contact"),
            });
          }
          const cont = contact.data as ResendContact;
          // We delete the contact
          const removeUser = await deleteContact(cont.id, audienceId);
          if (!removeUser.success) {
            toaster({
              type: "error",
              description: t("toasters.error-delete-contact"),
              // description: "Error while deleting contact from newsletter audience",
            });
          }
        }
        setActiveNewsletter(e);
        return toaster({
          description: `Newsletter ${e ? t("toasters.newsletter-enabled") : t("toasters.newsletter-disabled")}`,
          type: "success",
        });
      } else {
        return toaster({
          type: "error",
          description: t("toasters.error-update-newsletter"),
        });
      }
    }
  };
  return (
    <SwitchWrapper
      handleChange={handleChangeActiveNewsletter}
      checked={activeNewsletter}
      icon={<Newspaper className="icon" />}
      id="switch-active-newsletter">
      {t("switch-newsletter")}
    </SwitchWrapper>
  );
}
