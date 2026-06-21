import * as React from "react";
import {
  Button,
  ImageCropper,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent
} from '@platform-system/design-ui';
import { User } from "lucide-react";
import { useAccount } from "../hooks/use-account";
import { useTranslations } from "../translations/vi";
import { toast } from "sonner";
import { apiClient } from "../../../shared/api/apiClient";

function dataURLtoFile(dataurl: string, filename: string): File {
  const arr = dataurl.split(",");
  const mime = arr[0].match(/:(.*?);/)![1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}

export function MediaScreen() {
  const t = useTranslations("Account");
  const { profile, identityId, refetchProfile } = useAccount();

  const [isAvatarModalOpen, setIsAvatarModalOpen] = React.useState(false);
  const [initialCropState, setInitialCropState] = React.useState<{ zoom: number; x: number; y: number } | null>(null);
  const [currentOriginalImageUrl, setCurrentOriginalImageUrl] = React.useState<string | null>(null);

  const [isCoverModalOpen, setIsCoverModalOpen] = React.useState(false);
  const [initialCoverCropState, setInitialCoverCropState] = React.useState<{ zoom: number; x: number; y: number } | null>(null);
  const [currentOriginalCoverImageUrl, setCurrentOriginalCoverImageUrl] = React.useState<string | null>(null);

  const [isIntroModalOpen, setIsIntroModalOpen] = React.useState(false);
  const [initialIntroCropState, setInitialIntroCropState] = React.useState<{ zoom: number; x: number; y: number } | null>(null);
  const [currentOriginalIntroImageUrl, setCurrentOriginalIntroImageUrl] = React.useState<string | null>(null);



  React.useEffect(() => {
    if (identityId) {
      const serverAvatarOriginal = profile.avatarOriginal;
      const serverAvatarCrop = profile.avatarCrop;
      const serverCoverOriginal = profile.coverOriginal;
      const serverCoverCrop = profile.coverCrop;
      const serverIntroOriginal = profile.introOriginal;
      const serverIntroCrop = profile.introCrop;

      const original = localStorage.getItem("user_avatar_original_" + identityId);
      const stateStr = localStorage.getItem("user_avatar_crop_state_" + identityId);
      const originalCover = localStorage.getItem("user_cover_original_" + identityId);
      const coverStateStr = localStorage.getItem("user_cover_crop_state_" + identityId);
      const originalIntro = localStorage.getItem("user_intro_original_" + identityId);
      const introStateStr = localStorage.getItem("user_intro_crop_state_" + identityId);

      const savedAvatarUrl = localStorage.getItem("user_avatar_url_" + identityId);
      const savedCoverUrl = localStorage.getItem("user_cover_url_" + identityId);
      const savedIntroUrl = localStorage.getItem("user_intro_url_" + identityId);

      const currentAvatarUrlClean = profile.avatar ? profile.avatar.split("?")[0] : "";
      const currentCoverUrlClean = profile.cover ? profile.cover.split("?")[0] : "";
      const currentIntroUrlClean = profile.intro ? profile.intro.split("?")[0] : "";

      const savedAvatarUrlClean = savedAvatarUrl ? savedAvatarUrl.split("?")[0] : "";
      const savedCoverUrlClean = savedCoverUrl ? savedCoverUrl.split("?")[0] : "";
      const savedIntroUrlClean = savedIntroUrl ? savedIntroUrl.split("?")[0] : "";

      setTimeout(() => {
        if (serverAvatarOriginal) {
          setCurrentOriginalImageUrl(serverAvatarOriginal);
          setInitialCropState(serverAvatarCrop || null);
        } else if (original && currentAvatarUrlClean && currentAvatarUrlClean === savedAvatarUrlClean) {
          setCurrentOriginalImageUrl(original);
          if (stateStr) {
            try {
              setInitialCropState(JSON.parse(stateStr));
            } catch {
              setInitialCropState(null);
            }
          } else {
            setInitialCropState(null);
          }
        } else {
          setCurrentOriginalImageUrl(null);
          setInitialCropState(null);
        }

        if (serverCoverOriginal) {
          setCurrentOriginalCoverImageUrl(serverCoverOriginal);
          setInitialCoverCropState(serverCoverCrop || null);
        } else if (originalCover && currentCoverUrlClean && currentCoverUrlClean === savedCoverUrlClean) {
          setCurrentOriginalCoverImageUrl(originalCover);
          if (coverStateStr) {
            try {
              setInitialCoverCropState(JSON.parse(coverStateStr));
            } catch {
              setInitialCoverCropState(null);
            }
          } else {
            setInitialCoverCropState(null);
          }
        } else {
          setCurrentOriginalCoverImageUrl(null);
          setInitialCoverCropState(null);
        }

        if (serverIntroOriginal) {
          setCurrentOriginalIntroImageUrl(serverIntroOriginal);
          setInitialIntroCropState(serverIntroCrop || null);
        } else if (originalIntro && currentIntroUrlClean && currentIntroUrlClean === savedIntroUrlClean) {
          setCurrentOriginalIntroImageUrl(originalIntro);
          if (introStateStr) {
            try {
              setInitialIntroCropState(JSON.parse(introStateStr));
            } catch {
              setInitialIntroCropState(null);
            }
          } else {
            setInitialIntroCropState(null);
          }
        } else {
          setCurrentOriginalIntroImageUrl(null);
          setInitialIntroCropState(null);
        }
      }, 0);
    }
  }, [
    identityId,
    isAvatarModalOpen,
    isCoverModalOpen,
    isIntroModalOpen,
    profile.avatar,
    profile.cover,
    profile.intro,
    profile.avatarOriginal,
    profile.avatarCrop,
    profile.coverOriginal,
    profile.coverCrop,
    profile.introOriginal,
    profile.introCrop
  ]);


  return (
    <div className="relative z-10 text-foreground">
      <div className="mx-auto max-w-none">
        <div className="mb-8">
          <h1 className="font-serif text-3xl font-bold sm:text-4xl">Cập nhật hình ảnh</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Quản lý và cập nhật hình ảnh hồ sơ của bạn bao gồm ảnh đại diện, ảnh bìa và ảnh màn hình chờ.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Cột cài đặt */}
          <div className="lg:col-span-8">
            <div className="ds-glass-panel rounded-3xl p-6 shadow-2xl sm:p-8 border border-border">
              <Tabs defaultValue="avatar" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-8 bg-muted/40 p-1 rounded-xl">
                  <TabsTrigger value="avatar" className="rounded-lg text-sm py-2 cursor-pointer font-medium">
                    Ảnh đại diện
                  </TabsTrigger>
                  <TabsTrigger value="cover" className="rounded-lg text-sm py-2 cursor-pointer font-medium">
                    Ảnh bìa
                  </TabsTrigger>
                  <TabsTrigger value="intro" className="rounded-lg text-sm py-2 cursor-pointer font-medium">
                    Ảnh màn hình chờ
                  </TabsTrigger>
                </TabsList>

                {/* Avatar Tab */}
                <TabsContent value="avatar" className="flex flex-col items-center py-4 text-center">
                  <div className="relative size-40 rounded-full overflow-hidden border-2 border-white/20 bg-muted mb-6 shadow-lg flex items-center justify-center">
                    {profile.avatar ? (
                      <img src={profile.avatar} alt="Avatar" className="size-full object-cover" />
                    ) : (
                      <div className="size-full flex items-center justify-center bg-muted text-muted-foreground">
                        <User size={64} />
                      </div>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold mb-6">Ảnh đại diện</h3>
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full max-w-[240px]"
                    onClick={() => setIsAvatarModalOpen(true)}
                  >
                    Chỉnh sửa ảnh đại diện
                  </Button>
                </TabsContent>

                {/* Cover Tab */}
                <TabsContent value="cover" className="flex flex-col items-center py-4 text-center">
                  <div className="relative w-full max-w-lg aspect-[4/1] rounded-2xl overflow-hidden border-2 border-white/20 bg-muted mb-6 shadow-lg flex items-center justify-center">
                    {profile.cover ? (
                      <img src={profile.cover} alt="Cover" className="size-full object-cover" />
                    ) : (
                      <span className="text-sm text-muted-foreground font-medium">Chưa thiết lập ảnh bìa</span>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold mb-6">Ảnh bìa</h3>
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full max-w-[240px]"
                    onClick={() => setIsCoverModalOpen(true)}
                  >
                    Chỉnh sửa ảnh bìa
                  </Button>
                </TabsContent>

                {/* Intro Tab */}
                <TabsContent value="intro" className="flex flex-col items-center py-4 text-center">
                  <div className="relative w-full max-w-lg aspect-[21/10] rounded-2xl overflow-hidden border-2 border-white/20 bg-muted mb-6 shadow-lg flex items-center justify-center">
                    {profile.intro ? (
                      <img src={profile.intro} alt="Intro" className="size-full object-cover" />
                    ) : (
                      <span className="text-sm text-muted-foreground font-medium">Chưa thiết lập ảnh màn hình chờ</span>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold mb-6">Ảnh màn hình chờ</h3>
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full max-w-[240px]"
                    onClick={() => setIsIntroModalOpen(true)}
                  >
                    Chỉnh sửa ảnh màn hình chờ
                  </Button>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Cột xem trước giao diện */}
          <div className="lg:col-span-4 space-y-6">
            <div className="ds-glass-panel rounded-3xl p-6 border border-border shadow-lg space-y-6 relative overflow-hidden bg-card">
              <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-indigo-500/5 blur-2xl pointer-events-none" />
              
              <h3 className="font-serif text-lg font-bold text-foreground pb-2 border-b border-border">Xem trước giao diện</h3>

              {/* Profile Preview Card Mockup */}
              <div className="space-y-3">
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">Trang cá nhân</span>
                <div className="relative rounded-2xl border border-border overflow-hidden bg-muted/20 pb-4">
                  {/* Cover */}
                  <div className="h-20 w-full bg-muted relative overflow-hidden">
                    {profile.cover ? (
                      <img src={profile.cover} alt="Cover Preview" className="size-full object-cover" />
                    ) : (
                      <div className="size-full bg-gradient-to-r from-blue-500/20 to-purple-500/20" />
                    )}
                  </div>
                  {/* Avatar & Name & Info */}
                  <div className="px-4 pt-2 flex items-start gap-2">
                    {/* Avatar Wrapper with negative margin */}
                    <div className="relative -mt-10 size-16 rounded-full overflow-hidden border-2 border-background bg-muted shadow-md flex items-center justify-center shrink-0 z-10">
                      {profile.avatar ? (
                        <img src={profile.avatar} alt="Avatar Preview" className="size-full object-cover" />
                      ) : (
                        <div className="size-full flex items-center justify-center bg-muted text-muted-foreground">
                          <User size={24} />
                        </div>
                      )}
                    </div>
                    {/* Name and Join Date */}
                    <div className="min-w-0 flex-1 pt-2">
                      <h4 className="font-bold text-base text-foreground truncate leading-tight">
                        {profile.displayName || profile.name || "Tên hiển thị"}
                      </h4>
                      <p className="text-[11px] text-muted-foreground truncate mt-1">
                        {(() => {
                          if (!profile.joinedDate) return "Tham gia từ tháng 6 năm 2026";
                          const d = new Date(profile.joinedDate);
                          if (isNaN(d.getTime())) return "Tham gia từ tháng 6 năm 2026";
                          return `Tham gia từ tháng ${d.getMonth() + 1} năm ${d.getFullYear()}`;
                        })()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Lockscreen/Welcome Mockup */}
              <div className="space-y-3">
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">Màn hình chờ</span>
                <div className="relative aspect-[21/10] rounded-2xl border border-border overflow-hidden bg-muted/20 flex flex-col justify-end p-2">
                  {/* Background Image */}
                  {profile.intro ? (
                    <img src={profile.intro} alt="Welcome Preview" className="absolute inset-0 size-full object-cover" />
                  ) : (
                    <div className="absolute inset-0 size-full bg-gradient-to-br from-indigo-950 to-slate-900" />
                  )}
                  {/* Dark overlay at bottom only */}
                  <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-black/50 to-transparent z-10" />

                  {/* Bottom Left Profile Info */}
                  <div className="relative z-10 flex items-center gap-1 text-white text-left">
                    {profile.avatar ? (
                      <img src={profile.avatar} alt="Avatar Preview" className="size-8 rounded-full border border-white/40 object-cover shadow-md shrink-0" />
                    ) : (
                      <div className="size-8 rounded-full border border-white/40 bg-white/10 backdrop-blur-sm flex items-center justify-center shadow-md shrink-0">
                        <User size={12} className="text-white" />
                      </div>
                    )}
                    <span className="text-[10px] font-bold tracking-tight drop-shadow-md truncate max-w-[120px]">
                      {profile.displayName || profile.name || "Tài khoản Nyxoris"}
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      <ImageCropper
        key="avatar-cropper"
        open={isAvatarModalOpen}
        onOpenChange={setIsAvatarModalOpen}
        currentImageUrl={profile.avatar}
        currentOriginalImageUrl={currentOriginalImageUrl}
        initialCropState={initialCropState}
        title={t("updateAvatarTitle")}
        circular={true}
        outputSize={1024}
        labelType="avatar"
        onSave={async (croppedBase64, originalBase64, cropState) => {
          if (!identityId) return;
          try {
            const file = dataURLtoFile(croppedBase64, "avatar.jpg");
            const formData = new FormData();
            formData.append("altText", "Profile Avatar");
            formData.append("file", file);

            if (cropState) {
              formData.append("cropZoom", cropState.zoom.toString());
              formData.append("cropX", cropState.x.toString());
              formData.append("cropY", cropState.y.toString());
            }

            if (originalBase64) {
              if (originalBase64.startsWith("data:")) {
                const originalFile = dataURLtoFile(originalBase64, "original_avatar.jpg");
                formData.append("originalFile", originalFile);
              } else {
                formData.append("originalUrl", originalBase64);
              }
            }

            await apiClient.post(`/api/identity/users/me/images/avatar`, formData, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            });

            toast.success(t("updateAvatarSuccess"));
            const refetched = await refetchProfile();
            const newUrl = refetched.data?.avatarUrl;

            try {
              localStorage.setItem("user_avatar_" + identityId, croppedBase64);
              if (originalBase64) {
                localStorage.setItem("user_avatar_original_" + identityId, originalBase64);
              }
              if (cropState) {
                localStorage.setItem("user_avatar_crop_state_" + identityId, JSON.stringify(cropState));
              }
              if (newUrl) {
                localStorage.setItem("user_avatar_url_" + identityId, newUrl);
              }
            } catch (storageError) {
              console.warn("Storage quota exceeded, unable to cache avatar image locally:", storageError);
            }
            if (originalBase64) {
              setCurrentOriginalImageUrl(originalBase64);
            }
            if (cropState) {
              setInitialCropState(cropState);
            }
          } catch (err) {
            console.error(err);
            toast.error(t("updateAvatarError"));
          }
        }}
      />

      <ImageCropper
        key="cover-cropper"
        open={isCoverModalOpen}
        onOpenChange={setIsCoverModalOpen}
        currentImageUrl={profile.cover}
        currentOriginalImageUrl={currentOriginalCoverImageUrl}
        initialCropState={initialCoverCropState}
        title={t("updateCoverTitle")}
        circular={false}
        aspectRatio={4}
        outputSize={1920}
        labelType="cover"
        onSave={async (croppedBase64, originalBase64, cropState) => {
          if (!identityId) return;
          try {
            const file = dataURLtoFile(croppedBase64, "cover.jpg");
            const formData = new FormData();
            formData.append("altText", "Profile Cover Banner");
            formData.append("file", file);

            if (cropState) {
              formData.append("cropZoom", cropState.zoom.toString());
              formData.append("cropX", cropState.x.toString());
              formData.append("cropY", cropState.y.toString());
            }

            if (originalBase64) {
              if (originalBase64.startsWith("data:")) {
                const originalFile = dataURLtoFile(originalBase64, "original_cover.jpg");
                formData.append("originalFile", originalFile);
              } else {
                formData.append("originalUrl", originalBase64);
              }
            }

            await apiClient.post(`/api/identity/users/me/images/cover`, formData, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            });

            toast.success(t("updateCoverSuccess"));
            const refetched = await refetchProfile();
            const newUrl = refetched.data?.coverUrl;

            try {
              localStorage.setItem("user_cover_" + identityId, croppedBase64);
              if (originalBase64) {
                localStorage.setItem("user_cover_original_" + identityId, originalBase64);
              }
              if (cropState) {
                localStorage.setItem("user_cover_crop_state_" + identityId, JSON.stringify(cropState));
              }
              if (newUrl) {
                localStorage.setItem("user_cover_url_" + identityId, newUrl);
              }
            } catch (storageError) {
              console.warn("Storage quota exceeded, unable to cache cover image locally:", storageError);
            }
            if (originalBase64) {
              setCurrentOriginalCoverImageUrl(originalBase64);
            }
            if (cropState) {
              setInitialCoverCropState(cropState);
            }
          } catch (err) {
            console.error(err);
            toast.error(t("updateCoverError"));
          }
        }}
      />

      <ImageCropper
        key="intro-cropper"
        open={isIntroModalOpen}
        onOpenChange={setIsIntroModalOpen}
        currentImageUrl={profile.intro}
        currentOriginalImageUrl={currentOriginalIntroImageUrl}
        initialCropState={initialIntroCropState}
        title="Cập nhật ảnh màn hình chờ"
        circular={false}
        aspectRatio={21 / 10}
        outputSize={1920}
        labelType="intro"
        onSave={async (croppedBase64, originalBase64, cropState) => {
          if (!identityId) return;
          try {
            const file = dataURLtoFile(croppedBase64, "intro.jpg");
            const formData = new FormData();
            formData.append("altText", "Profile Intro Background");
            formData.append("file", file);

            if (cropState) {
              formData.append("cropZoom", cropState.zoom.toString());
              formData.append("cropX", cropState.x.toString());
              formData.append("cropY", cropState.y.toString());
            }

            if (originalBase64) {
              if (originalBase64.startsWith("data:")) {
                const originalFile = dataURLtoFile(originalBase64, "original_intro.jpg");
                formData.append("originalFile", originalFile);
              } else {
                formData.append("originalUrl", originalBase64);
              }
            }

            await apiClient.post(`/api/identity/users/me/images/intro`, formData, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            });

            toast.success("Cập nhật ảnh màn hình chờ thành công");
            const refetched = await refetchProfile();
            const newUrl = refetched.data?.introUrl;

            try {
              localStorage.setItem("user_intro_" + identityId, croppedBase64);
              if (originalBase64) {
                localStorage.setItem("user_intro_original_" + identityId, originalBase64);
              }
              if (cropState) {
                localStorage.setItem("user_intro_crop_state_" + identityId, JSON.stringify(cropState));
              }
              if (newUrl) {
                localStorage.setItem("user_intro_url_" + identityId, newUrl);
              }
            } catch (storageError) {
              console.warn("Storage quota exceeded, unable to cache intro image locally:", storageError);
            }
            if (originalBase64) {
              setCurrentOriginalIntroImageUrl(originalBase64);
            }
            if (cropState) {
              setInitialIntroCropState(cropState);
            }
          } catch (err) {
            console.error(err);
            toast.error("Lỗi khi cập nhật ảnh màn hình chờ");
          }
        }}
      />
    </div>
  );
}
